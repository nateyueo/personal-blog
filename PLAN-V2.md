# 个人博客 V2 功能升级计划

## 架构变更
- ~~Astro `output: 'static'` → `output: 'hybrid'`~~ 保持 static 模式，无需 SSR
- ~~新增 Cloudflare Workers adapter~~ 不需要，Cloudflare Pages 直接部署静态站
- ~~新增后端：Cloudflare D1 (SQLite) + KV~~ 改用 localStorage 客户端方案 + Waline 第三方后端

## Phase 1: 基础互动功能（P0）

### 1.1 评论系统 — Waline
- ✅ 创建 `<Comments />` 组件嵌入博客页
- ✅ 支持 CDN 加载 Waline 客户端，适配暗色主题
- ✅ 支持匿名 + GitHub 登录评论
- ⏳ 部署 Waline 后端到 Vercel（需用户配置 `PUBLIC_WALINE_SERVER_URL` 环境变量）
- ⏳ 评论管理后台（Waline 自带）

### 1.2 文章反应/点赞
- ✅ `<ReactionBar />` 组件（👍❤️🎉🤔 四种表情）
- ✅ localStorage 客户端存储（轻量级方案）
- ~~Cloudflare Workers + D1 API~~ 改为纯客户端方案

### 1.3 社交分享
- ✅ `<ShareButtons />` 组件
- ✅ Web Share API（移动端）+ 降级按钮
- ✅ 平台：Twitter/X、微博、复制链接
- ✅ 动态 OG 图片生成（Satori + resvg-js，构建时生成）

### 1.4 阅读增强
- ✅ `<ReadingProgress />` 滚动进度条
- ✅ `<BackToTop />` 回到顶部按钮
- ✅ 相关文章推荐（基于标签 + 分类匹配评分）
- ✅ 文章封面图渲染（PostCard + BlogLayout）
- ✅ 博客分页（POSTS_PER_PAGE = 10）

## Phase 2: 内容丰富化（P1）

### 2.1 随想/Memos 短内容
- ✅ 新增 `thoughts` Content Collection（支持 mood、tags、draft）
- ✅ `/thoughts` 时间线页面
- ✅ `<ThoughtCard />` 卡片组件
- ✅ 首页展示最近随想

### 2.2 本地收藏 & 阅读历史
- ✅ `<BookmarkButton />` — localStorage 收藏
- ✅ `/bookmarks` 收藏页
- ✅ 阅读历史记录（自动追踪）
- ✅ "继续阅读" 首页入口

### 2.3 Newsletter 订阅
- ✅ `<NewsletterForm />` 组件（首页 + 文章底部）
- ⏳ 邮件收集后端（需接入 Resend/Buttondown，当前存 localStorage）

### 2.4 数据分析
- ✅ Cloudflare Web Analytics（beacon 脚本已集成）
- ⏳ 页面浏览量展示（需在 Cloudflare Dashboard 配置 token）

## Phase 3: 用户系统（P2 — 后续迭代）
- Supabase Auth（GitHub + Google + 邮箱）
- 用户资料页
- 云端同步收藏/历史
- 通知系统

---

## 实施状态

### 已完成 ✅
1. 阅读增强：进度条、回到顶部、相关文章、封面图、分页
2. 社交分享按钮（Twitter/X、微博、复制链接、Web Share API）
3. 文章反应/点赞（客户端 localStorage）
4. 随想/Memos 短内容系统
5. 本地收藏 & 阅读历史
6. Newsletter 订阅表单（前端）
7. Waline 评论组件（前端，需配置后端 URL）
8. Cloudflare Web Analytics（需配置 token）
9. OG 图片动态生成（Satori，构建时）

### 需用户操作 ⏳
1. **Waline 后端部署**: 前往 https://waline.js.org/guide/get-started/ 部署到 Vercel，然后设置环境变量 `PUBLIC_WALINE_SERVER_URL`
2. **Cloudflare Web Analytics**: 在 Cloudflare Dashboard 获取 Web Analytics token，填入 BaseLayout 的 beacon 脚本 `data-cf-beacon` 属性
3. **Newsletter 后端**: 可选接入 Resend/Buttondown 等邮件服务
