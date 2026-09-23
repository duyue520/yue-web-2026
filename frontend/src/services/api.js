/**
 * 后端 API 服务封装
 */
// 智能选择后端
function getApiBase() {
  if (import.meta?.env?.VITE_API_BASE) return import.meta.env.VITE_API_BASE;
  const host = window.location.hostname;
  // 腾讯云 CDN：需要完整后端地址
  if (host.includes('tcloudbaseapp.com')) {
    return 'http://119.91.113.191:8000';
  }
  return '';  // Vite 代理 /api → localhost:8000
}
const API_BASE = getApiBase();

// Token 管理
function getToken() {
  return localStorage.getItem('disease_token');
}
function setToken(t) {
  localStorage.setItem('disease_token', t);
}
function clearToken() {
  localStorage.removeItem('disease_token');
  localStorage.removeItem('disease_user');
}

// 通用请求
async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = { ...options.headers };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  headers['Accept'] = 'application/json';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const res = await fetch(url, { ...options, headers, signal: controller.signal });
    clearTimeout(timeout);
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
      let detail = `服务器错误 (${res.status})`;
      if (contentType.includes('application/json')) {
        try {
          const data = await res.json();
          if (data.detail) {
            // FastAPI 422 验证错误返回数组: [{"loc":...,"msg":...}]
            if (Array.isArray(data.detail)) {
              detail = data.detail.map(d => d.msg || d.message || JSON.stringify(d)).join('；');
            } else if (typeof data.detail === 'object') {
              detail = data.detail.msg || data.detail.message || JSON.stringify(data.detail);
            } else {
              detail = String(data.detail);
            }
          }
        } catch (_) {}
      } else if (res.status === 422) {
        detail = '请检查输入信息是否完整正确';
      } else if (res.status >= 500) {
        detail = '服务器内部错误，请稍后重试';
      }
      throw new Error(detail);
    }
    const data = await res.json();
    return data;
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error('请求超时，请检查网络后重试');
    }
    if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) {
      throw new Error('无法连接服务器，请确认后端已启动');
    }
    throw e;
  }
}

export default {
  // ========== 认证 ==========
  async register(username, password) {
    const cleanUser = (username || '').trim();
    const cleanPwd = (password || '').trim();
    if (!cleanUser || cleanUser.length < 2) throw new Error('用户名至少2个字符');
    if (!cleanPwd || cleanPwd.length < 6) throw new Error('密码至少6个字符');
    const data = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: cleanUser, password: cleanPwd }),
    });
    setToken(data.access_token);
    try {
      const info = await request('/api/auth/me');
      localStorage.setItem('disease_user', JSON.stringify({ id: info.id, username: info.username }));
    } catch(e) {
      localStorage.setItem('disease_user', JSON.stringify({ username: data.username }));
    }
    return data;
  },
  async login(username, password) {
    const cleanUser = (username || '').trim();
    const cleanPwd = (password || '').trim();
    if (!cleanUser) throw new Error('请输入用户名');
    if (!cleanPwd) throw new Error('请输入密码');
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: cleanUser, password: cleanPwd }),
    });
    setToken(data.access_token);
    try {
      const info = await request('/api/auth/me');
      localStorage.setItem('disease_user', JSON.stringify({ id: info.id, username: info.username }));
    } catch(e) {
      localStorage.setItem('disease_user', JSON.stringify({ username: data.username }));
    }
    return data;
  },
  logout() {
    clearToken();
  },
  isLoggedIn() {
    return !!getToken();
  },
  getUser() {
    const u = localStorage.getItem('disease_user');
    return u ? JSON.parse(u) : null;
  },
  async fetchUserInfo() {
    return await request('/api/auth/me');
  },

  // ========== 诊断 ==========
  async predict(imageFile, enableGradcam = false) {
    const form = new FormData();
    form.append('image', imageFile);
    return await request(`/api/predict?enable_gradcam=${enableGradcam}`, {
      method: 'POST',
      body: form,
    });
  },
  async predictBatch(files) {
    const form = new FormData();
    files.forEach(f => form.append('images', f));
    return await request('/api/predict/batch', { method: 'POST', body: form });
  },

  // ========== 历史 ==========
  async getHistory(skip = 0, limit = 20) {
    return await request(`/api/auth/history?skip=${skip}&limit=${limit}`);
  },
  async deleteHistoryRecord(id) {
    return await request('/api/auth/history/' + id, { method: 'DELETE' });
  },
  async deleteAllHistory() {
    return await request('/api/auth/history', { method: 'DELETE' });
  },

  // ========== 反馈 ==========
  async submitFeedback(category, title, content) {
    return await request('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({ category, title, content }),
    });
  },
  async getMyFeedbacks() {
    return await request('/api/feedback/my');
  },

  // ========== 纠错 ==========
  async correctPrediction(diagnosisId, originalPred, correctedLabel) {
    return await request('/api/correct', {
      method: 'POST',
      body: JSON.stringify({
        diagnosis_id: diagnosisId,
        original_prediction: originalPred,
        corrected_label: correctedLabel,
      }),
    });
  },

  // ========== 导出 ==========
  async exportExcel() {
    const token = getToken();
    const res = await fetch(`${API_BASE}/api/export/excel`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('导出失败');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '叶片病害诊断记录.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  },

  // ========== 个人中心 ==========
  async getProfile() {
    return await request('/api/auth/profile');
  },
  async updateProfile(username, avatarBase64) {
    return await request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ username: username || '', avatar_base64: avatarBase64 || '' }),
    });
  },
  async changePassword(oldPwd, newPwd) {
    return await request('/api/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ old_password: oldPwd, new_password: newPwd }),
    });
  },

  // 忘记密码已取消（不再需要邮箱验证）
  async uploadAvatar(file) {
    const form = new FormData();
    form.append('image', file);
    return await request('/api/auth/avatar', {
      method: 'POST',
      body: form,
    });
  },

  // ========== 公共留言板 ==========
  async getGuestbookMessages(skip = 0) {
    return await request('/api/guestbook?skip=' + skip + '&limit=50');
  },
  async postGuestbookMessage(nickname, content) {
    return await request('/api/guestbook', {
      method: 'POST',
      body: JSON.stringify({ nickname, content }),
    });
  },
  async deleteGuestbookMessage(id) {
    return await request('/api/guestbook/' + id, {
      method: 'DELETE',
    });
  },

  // ========== 在线音乐（搜索/播放信息/歌词） ==========
  async musicSearch(kw, limit = 20) {
    return await request(`/api/music/search?kw=${encodeURIComponent(kw || '')}&limit=${limit}`);
  },
  async musicSong(id) {
    return await request(`/api/music/song?id=${id}`);
  },
  async musicLyric(id) {
    return await request(`/api/music/lyric?id=${id}`);
  },

  // ========== 健康检查 ==========
  async healthCheck() {
    return await request('/api/health');
  },

  API_BASE,
};
