# PostgreSQL 迁移交接（未操作私人记录）

## 数据形态

依据源码，业务表 8 张：users、diagnosis_records、feedbacks、corrected_labels、guestbook_messages、blog_categories、blog_articles、blog_comments；另由 Alembic 维护 alembic_version。

账户密码哈希、头像/图片 base64、历史、反馈、纠错、博客及留言均属于持久数据；模型是镜像内只读资产。原 SQLite 路径 server/app.db 已发现，但本任务未打开它、未查 sqlite_master/PRAGMA、未读取用户记录、未复制它。因此不能声称实际旧库字段与源码完全一致。

## 新库

获准持久服务后，在新空 PostgreSQL 执行 `python -m alembic upgrade head`。0001 显式建立所有表、索引、外键，保留原业务 nullable/default 语义（ORM 端默认而非 SQL server default）。匿名 blog_comments.user_id 允许 NULL。

迁移失败不应 stamp head、更不应 drop/create；先保留错误类别，私下检查连接/权限/已有表状态。启动只检查 Alembic revision，禁止 auto-create。生产给 migration role DDL 权限，应用 role 仅需 DML/sequence 权限；初次验证可以同 role，后续再收紧。数据库 URL 别写日志。

## 旧数据（明确未执行、需另行授权）

1. 停写、使用 SQLite 官方 backup API 获取一致私密快照（WAL 场景不能仅复制主文件），加密离线保存；不上传代码仓库。
2. 只在获准后检查快照 schema/version，比较 users.avatar_base64/email unique、guestbook.owner_name 等字段，制定差异映射；create_all 不会替旧表添加列。
3. 外键顺序：users、blog_categories → diagnosis_records/feedbacks/guestbook/blog_articles → corrected_labels/blog_comments。
4. 保留 ID、时间、密码哈希和字段值；SQLite 0/1 Boolean 显式转 bool、时间按原 UTC 无时区处理。匿名评论 user_id=0 需明确转换 NULL；其他孤儿外键隔离到私密问题清单，不虚造用户、不默默删记录。审核 overlength 字符串，因为 SQLite 不严格执行 VARCHAR 限长而 PostgreSQL 会拒绝。
5. 密码原服务使用 pbkdf2_sha256，不重新哈希已哈希字符串。若实际旧库还有其他历史算法，应单独适配而非重置所有密码。
6. 导入成功后逐表校验计数、ID/引用和必要校验摘要，修复 SERIAL sequence 到 max(id)，专用测试账号验证登录/归属/导出；报告中仅计数和校验结果，不输出私人记录。
7. 旧库只读保留到验收完成；失败回滚新 PostgreSQL 事务/恢复备份，不改原库。

## 备份与恢复

Neon Free 有容量、计算和恢复窗口限制，外置持久化不是永久 SLA。定期通过受保护的连接及 pg_dump 做加密异地备份；备份和恢复操作属于私人数据访问，未在此次执行。需要在另一空测试库进行恢复演练、检查序列/外键、抽样业务验收。若达到容量或服务不可用，本包将失败/503，而不是回退临时 SQLite。

目前缺少数据库授权和连接串，云端迁移/数据迁移/重启不丢数据验收均受阻。不存在已完成的旧库转移。
