<template>
  <v-dialog v-model="visible" fullscreen :scrim="false" transition="dialog-bottom-transition">
    <div class="blog-overlay">
      <v-toolbar color="transparent" density="compact" flat class="blog-bar">
        <v-toolbar-title><v-icon start color="green-darken-2" size="26">mdi-post-outline</v-icon><span class="text-h6 font-weight-bold">博客</span></v-toolbar-title>
        <v-spacer/>
        <v-btn variant="flat" color="green-darken-2" rounded="lg" prepend-icon="mdi-plus" size="small" @click="openEditor()">写文章</v-btn>
        <v-btn icon size="small" variant="text" @click="closeBlog" class="ml-1"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <div class="blog-content">
        <div class="cats-row mb-4">
          <v-chip size="small" variant="tonal" :color="activeCat===''?'green-darken-2':''" @click="load('')" pill class="mr-1">全部</v-chip>
          <v-chip v-for="c in categories" :key="c.id" v-show="c.count>0" size="small" variant="tonal" :color="activeCat===c.name?'green-darken-2':''" @click="load(c.name)" pill class="mr-1">{{c.name}}<span class="text-caption ml-1">({{c.count}})</span></v-chip>
        </div>
        <div v-if="articles.length" class="post-list">
          <div v-for="(a,i) in articles" :key="a.id" :class="['post-card', i%2===0?'post-left':'post-right']" @click="openArticle(a)">
            <div class="post-img"><v-img :src="a.cover_url||getCover(a.id)" cover class="post-thumb"/><div class="post-date-chip">{{formatTime(a.created_at)}}</div></div>
            <div class="post-text">
              <div class="post-cat">{{a.category||'未分类'}}</div><h3 class="post-title">{{a.title}}</h3><p class="post-summary">{{a.summary||''}}</p>
              <div class="post-meta"><v-icon size="13">mdi-eye-outline</v-icon> {{a.views}}<v-icon size="13" class="ml-2">mdi-account-outline</v-icon> {{a.author}}
                <v-btn v-if="canDel(a)" icon size="20" variant="text" color="red" class="ml-1" @click.stop="del(a)"><v-icon size="14">mdi-delete</v-icon></v-btn></div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state"><v-icon size="56" color="grey-lighten-1">mdi-post-outline</v-icon><p>还没有文章，写第一篇吧</p></div>
      </div>

      <v-dialog v-model="showEditor" width="780" :scrim="true"><v-card class="editor-glass" rounded="xl">
        <v-card-title class="d-flex align-center"><v-icon color="green-darken-2" class="mr-2">mdi-pencil</v-icon>{{editing?'编辑文章':'写文章'}}<v-spacer/><v-btn icon size="small" variant="text" @click="showEditor=false"><v-icon>mdi-close</v-icon></v-btn></v-card-title>
        <v-card-text>
          <v-text-field v-model="editTitle" label="文章标题" variant="outlined" density="comfortable" hide-details class="mb-3" bg-color="rgba(255,255,255,0.5)"/>
          <v-text-field v-model="editCat" label="分类标签" variant="outlined" density="comfortable" hide-details class="mb-3" bg-color="rgba(255,255,255,0.5)"/>
          <v-textarea v-model="editContent" label="正文 (支持Markdown)" variant="outlined" rows="12" hide-details class="mb-3" bg-color="rgba(255,255,255,0.5)"/>
          <v-btn block size="large" color="green-darken-2" variant="flat" rounded="lg" :loading="pub" @click="publish"><v-icon start>mdi-send</v-icon>{{editing?'保存修改':'发布文章'}}</v-btn>
        </v-card-text>
      </v-card></v-dialog>

      <v-dialog v-model="showDetail" width="860" :scrim="true"><v-card class="detail-glass" rounded="xl" v-if="article">
        <div class="detail-hero"><v-img :src="article.cover_url||getCover(article.id)" height="240" cover class="detail-cover"/><div class="detail-hero-text"><div class="text-caption mb-1">{{article.category||'未分类'}}</div><h1 class="text-h4 font-weight-bold">{{article.title}}</h1><div class="text-caption mt-1"><v-icon size="13">mdi-account</v-icon>{{article.author}} &nbsp; <v-icon size="13">mdi-clock</v-icon>{{formatTime(article.created_at)}} &nbsp; <v-icon size="13">mdi-eye</v-icon>{{article.views}}阅读</div></div></div>
        <v-card-text class="detail-body">
          <div class="article-md" v-html="renderMarkdown(article.content)"></div>
          <v-divider class="my-6"/>
          <div class="d-flex align-center"><h3 class="mb-0"><v-icon start color="green-darken-2">mdi-comment-text</v-icon>{{article.comments?.length||0}} 条评论</h3><v-spacer/><v-btn v-if="canEdit" size="small" variant="tonal" color="green-darken-2" prepend-icon="mdi-pencil" @click="editArticle(article)" rounded="lg">编辑</v-btn></div>
          <div v-for="c in article.comments" :key="c.id" class="comment-bubble mt-2"><div class="d-flex align-center"><strong>{{c.author}}</strong><span class="text-caption text-grey ml-2">{{formatTime(c.created_at)}}</span><v-spacer/><v-btn v-if="canDelComment(c)" icon size="20" variant="text" color="red" @click="delComment(c)"><v-icon size="14">mdi-delete</v-icon></v-btn></div><p class="mt-1 mb-0">{{c.content}}</p></div>
          <div class="d-flex mt-3"><v-text-field v-model="newComment" placeholder="匿名评论..." variant="outlined" density="compact" hide-details bg-color="rgba(255,255,255,0.5)" class="flex-grow-1"/><v-btn icon size="40" variant="text" color="green-darken-2" @click="postComment" class="ml-2"><v-icon>mdi-send-circle</v-icon></v-btn></div>
        </v-card-text>
      </v-card></v-dialog>
    </div>
  </v-dialog>
</template>

<script>
import api from '../services/api.js';
export default {
  name:'BlogPage',
  data(){return{visible:false,showEditor:false,showDetail:false,editTitle:'',editCat:'',editContent:'',editCover:'',pub:false,activeCat:'',categories:[],articles:[],article:null,newComment:'',editing:false,editId:null,covers:[]}},
  computed:{canEdit(){const u=localStorage.getItem('disease_user');if(!u||!this.article)return false;const name=JSON.parse(u).username;return name===this.article.author||name==='杜越'}},
  watch:{visible(v){if(v){this.load('');this.initCovers()}}},
  methods:{
    formatTime(t){if(!t)return"";const d=new Date(t+"Z");const bj=new Date(d.getTime()+8*3600000);return bj.getFullYear()+"-"+String(bj.getMonth()+1).padStart(2,"0")+"-"+String(bj.getDate()).padStart(2,"0")+" "+String(bj.getHours()).padStart(2,"0")+":"+String(bj.getMinutes()).padStart(2,"0")},
	    closeBlog(){this.visible=false;window.location.hash=''},
    initCovers(){if(!this.covers.length)for(let i=1;i<=20;i++)this.covers.push('/covers/OIP-C ('+i+').webp')},
    getCover(id){const i=(id||1)%20+1;return '/covers/OIP-C ('+i+').webp'},
    canDel(a){const u=localStorage.getItem('disease_user');if(!u)return false;const name=JSON.parse(u).username;return name===a.author||name==='杜越'},
    canDelComment(c){const u=localStorage.getItem('disease_user');if(!u)return false;const name=JSON.parse(u).username;return name===c.author||name==='杜越'},
    async delComment(c){const t=localStorage.getItem('disease_token');try{await fetch((api.API_BASE||'')+'/api/blog/comments/'+c.id,{method:'DELETE',headers:{Authorization:'Bearer '+t}});this.openArticle({id:this.article.id})}catch(e){}},
    async del(a){if(!confirm('确定删除？'))return;const t=localStorage.getItem('disease_token');try{await fetch((api.API_BASE||'')+'/api/blog/articles/'+a.id,{method:'DELETE',headers:{Authorization:'Bearer '+t}});this.load('')}catch(e){}},
    async apiGet(p){const r=await fetch((api.API_BASE||'')+p,{headers:api.isLoggedIn()?{Authorization:'Bearer '+localStorage.getItem('disease_token')}:{}});return r.json()},
    async load(cat){this.activeCat=cat;try{const d=await this.apiGet('/api/blog/articles?category='+cat);this.articles=d.articles||[]}catch(e){}try{this.categories=await this.apiGet('/api/blog/categories')}catch(e){}},
    async openArticle(a){try{this.article=await this.apiGet('/api/blog/articles/'+a.id);this.showDetail=true}catch(e){}},
    openEditor(){this.editing=false;this.editId=null;this.editTitle='';this.editCat='';this.editContent='';this.editCover='';this.showEditor=true},
    async publish(){if(!this.editTitle.trim()||!this.editContent.trim()){alert('请填写标题和内容');return}this.pub=true;try{const t=localStorage.getItem('disease_token');const b={title:this.editTitle,content:this.editContent,category_name:this.editCat,cover_url:this.editCover};if(this.editing){await fetch((api.API_BASE||'')+'/api/blog/articles/'+this.editId,{method:'PUT',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(b)});}else{await fetch((api.API_BASE||'')+'/api/blog/articles',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(b)});}this.showEditor=false;this.editing=false;this.load('')}catch(e){alert('操作失败')}finally{this.pub=false}},
    editArticle(a){this.showDetail=false;this.$nextTick(()=>{this.editing=true;this.editId=a.id;this.editTitle=a.title;this.editCat=a.category;this.editContent=a.content;this.editCover=a.cover_url||'';this.showEditor=true})},
    async postComment(){if(!this.newComment.trim()||!this.article)return;const t=localStorage.getItem('disease_token');try{await fetch((api.API_BASE||'')+'/api/blog/articles/'+this.article.id+'/comments',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify({content:this.newComment})});this.newComment='';this.openArticle({id:this.article.id})}catch(e){}},
    renderMarkdown(t){
      if(!t)return'';
      t=t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      t=t.replace(/^### (.+)$/gm,'<h4>$1</h4>');t=t.replace(/^## (.+)$/gm,'<h3>$1</h3>');t=t.replace(/^# (.+)$/gm,'<h2>$1</h2>');
      t=t.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');t=t.replace(/`(.+?)`/g,'<code>$1</code>');
      t=t.replace(/^- (.+)$/gm,'<li>$1</li>');t=t.replace(/(<li>.*<\/li>\n?)+/g,'<ul>$&</ul>');
      t=t.replace(/^> (.+)$/gm,'<blockquote>$1</blockquote>');t=t.replace(/^---$/gm,'<hr/>');
      t=t.replace(/\[(.+?)\]\((.+?)\)/g,'<a href=\"$2\" target=\"_blank\">$1</a>');
      return '<div class=\"md-body\">'+t.replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br>').replace(/^(.+)$/gm,'<p>$1</p>')+'</div>';
    },
  },
  mounted(){}
};
</script>

<style scoped>
.blog-overlay{position:fixed;inset:0;background:rgba(255,255,255,0.95);backdrop-filter:blur(28px);z-index:1000;display:flex;flex-direction:column}
.blog-bar{background:rgba(255,255,255,0.8)!important;border-bottom:1px solid rgba(0,0,0,0.04);padding:0 8px}
.blog-content{flex:1;overflow-y:auto;padding:24px 20px 60px;max-width:860px;margin:0 auto;width:100%}
.cats-row{display:flex;flex-wrap:wrap;gap:4px}
.post-list{display:flex;flex-direction:column;gap:24px}
.post-card{display:flex;border-radius:16px;overflow:hidden;cursor:pointer;background:rgba(255,255,255,0.8);box-shadow:0 2px 16px rgba(0,0,0,0.04);transition:all .3s;animation:fadeUp .5s ease both}
.post-card:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,0.08)}
.post-card:nth-child(even){flex-direction:row-reverse}
.post-img{flex:0 0 45%;position:relative;min-height:200px;overflow:hidden}
.post-thumb{width:100%;height:100%;transition:transform .8s}
.post-card:hover .post-thumb{transform:scale(1.05)}
.post-date-chip{position:absolute;top:12px;left:12px;background:rgba(255,255,255,0.9);backdrop-filter:blur(8px);padding:3px 12px;border-radius:20px;font-size:12px;color:#666}
.post-text{flex:1;padding:20px 24px;display:flex;flex-direction:column;justify-content:center}
.post-cat{font-size:12px;color:#2e7d32;margin-bottom:6px;font-weight:600}
.post-title{font-size:20px;color:#333;margin:0 0 8px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.post-summary{font-size:14px;color:#999;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:0 0 12px}
.post-meta{font-size:12px;color:#aaa;display:flex;align-items:center}
.empty-state{text-align:center;padding:80px 20px;color:#ccc}
.editor-glass,.detail-glass{background:rgba(255,255,255,0.97)!important;backdrop-filter:blur(24px)}
.detail-hero{position:relative;border-radius:16px 16px 0 0;overflow:hidden}
.detail-cover{filter:brightness(0.5)}
.detail-hero-text{position:absolute;bottom:20px;left:24px;color:#fff;right:24px}
.detail-body{padding:28px}
.article-md{font-size:16px;line-height:2;color:#444}
.md-body p{font-size:16px;line-height:2;color:#444;margin:0 0 16px;text-indent:2em}
.md-body h2,.md-body h3,.md-body h4{color:#2e7d32;margin:24px 0 12px}
.md-body blockquote{border-left:4px solid #2e7d32;background:#f1f8e9;padding:12px 16px;margin:12px 0;border-radius:0 8px 8px 0;color:#555}
.md-body code{background:#f5f5f5;padding:2px 6px;border-radius:4px;color:#e91e63}
.md-body ul{padding-left:24px;margin:12px 0}
.md-body li{margin:6px 0;line-height:1.8}
.md-body hr{border:none;border-top:2px dashed #e0e0e0;margin:24px 0}
.comment-bubble{background:rgba(0,0,0,0.02);padding:12px 16px;border-radius:12px}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:700px){.post-card,.post-card:nth-child(even){flex-direction:column}.post-img{flex:0 0 160px}}
</style>
