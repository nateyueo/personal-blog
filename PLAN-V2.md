# 个人博客 V2 功能升级计划

## 架构变更
- Astro `output: 'static'` → `output: 'hybrid'`（支持部分 SSR API 端点）
- 新增 Cloudflare Workers adapter（`@astrojs/cloudflare`）
- 新增后端：Cloudflare D1 (SQLite) + KV（反应计数/会话缓存）

## Phase 1: 基础互动功能（P0）

### 1.1 评论系统 — Waline
- 部署 Waline 到 Vercel（后端）
- 创建 `<Comments />` 组件嵌入博客/文档页
- 支持匿名 + GitHub 登录评论
- 评论管理后台

### 1.2 文章反应/点赞
- Cloudflare Workers + D1 实现 API
- `/api/reactions` — GET/POST 端点
- `<ReactionBar />` 组件（👍❤️🎉🤔 四种表情）
- 指纹防刷（IP + UA hash）
- 首页/列表页展示反应数

### 1.3 社交分享
- `<ShareButtons />` 组件
- Web Share API（移动端）+ 降级按钮
- 平台：Twitter/X、微信（QR码）、微博、复制链接
- 动态 OG 图片生成（Satori，构建时）

### 1.4 阅读增强
- `<ReadingProgress />` 滚动进度条
- `<BackToTop />` 回到顶部按钮
- 相关文章推荐（基于标签匹配）
- 文章封面图渲染（PostCard + BlogLayout）
- 博客分页（POSTS_PER_PAGE 生效）

## Phase 2: 内容丰富化（P1）

### 2.1 随想/Memos 短内容
- 新增 `thoughts` Content Collection
- `/thoughts` 时间线页面
- `<ThoughtCard />` 卡片组件
- 支持 Markdown + 图片

### 2.2 本地收藏 & 阅读历史
- `<BookmarkButton />` — localStorage 收藏
- `/bookmarks` 收藏页
- 阅读历史记录（自动追踪）
- "继续阅读" 首页入口

### 2.3 Newsletter 订阅
- `<NewsletterForm />` 组件
- 邮件收集 API（Cloudflare Worker → Resend/Buttondown）
- 首页 + 文章底部 CTA

### 2.4 数据分析
- Umami 自托管 or Cloudflare Web Analytics
- 页面浏览量展示
- 热门文章排行

## Phase 3: 用户系统（P2 — 后续迭代）
- Supabase Auth（GitHub + Google + 邮箱）
- 用户资料页
- 云端同步收藏/历史
- 通知系统

---

## 执行顺序（本次实施 Phase 1 + Phase 2）

1. ✅ 架构升级：hybrid 模式 + Cloudflare adapter
2. ✅ 阅读增强：进度条、回到顶部、相关文章、封面图、分页
3. ✅ 评论系统：Waline 集成
4. ✅ 文章反应/点赞：D1 + API
5. ✅ 社交分享按钮
6. ✅ 随想/Memos
7. ✅ 本地收藏 & 阅读历史
8. ✅ Newsletter 订阅
9. ✅ 页面浏览量
