# 个人博客 + PRD 手册一体化网站 — 技术架构与实施蓝图

## 1. 技术选型

| 模块 | 方案 | 说明 |
|------|------|------|
| 站点生成 | **Astro 5.x** | Content Collections 原生支持多内容域，零 JS 默认输出 |
| 样式 | **Tailwind CSS v4** + `@tailwindcss/typography` | 设计系统 + Markdown 排版 |
| CDN 托管 | **Cloudflare Pages** | 免费、全球 CDN、自动 HTTPS、预览部署 |
| 搜索（V0） | **Fuse.js** | 本地模糊搜索，构建时生成索引 |
| 搜索（V1） | Algolia DocSearch | 爬虫自动索引、毫秒级响应 |
| 评论（V1） | giscus | 基于 GitHub Discussions，零后端 |
| 统计 | Plausible / GA4 | 隐私友好 |
| CI/CD | GitHub Actions + Cloudflare Pages Git 集成 | 推送即发布 |
| 代码高亮 | Expressive Code (Shiki) | 行号、行高亮、diff、文件名 |

## 2. 项目目录结构

```
/
├── .github/workflows/deploy.yml
├── public/
│   ├── favicon.svg
│   ├── og-default.png
│   └── fonts/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │       ├── global.css
│   │       └── prose.css
│   ├── components/
│   │   ├── common/          # Header, Footer, ThemeToggle, Search, TOC, Breadcrumb, SEOHead
│   │   ├── blog/            # PostCard, PostMeta, SeriesNav, RelatedPosts
│   │   ├── docs/            # DocSidebar, DocPagination
│   │   └── widgets/         # Callout, LinkCard
│   ├── content/
│   │   ├── config.ts        # Content Collections schema
│   │   ├── blog/            # 博客文章（按年份组织）
│   │   └── docs/            # PRD 手册（按章节组织）
│   ├── data/
│   │   ├── navigation.ts
│   │   └── site.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── BlogLayout.astro
│   │   ├── DocsLayout.astro
│   │   └── PageLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   ├── [...slug].astro
│   │   │   ├── tags/
│   │   │   ├── categories/
│   │   │   └── series/
│   │   ├── docs/
│   │   │   └── [...slug].astro
│   │   ├── rss.xml.ts
│   │   ├── search.json.ts
│   │   └── 404.astro
│   └── utils/
│       ├── reading-time.ts
│       ├── date.ts
│       ├── search-index.ts
│       └── docs-sidebar.ts
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## 3. Content Collections Schema

### 博客 (blog)
```yaml
title: string (max 100)
description: string (max 200)
publishDate: date
updatedDate: date?
category: enum [tech, product, thinking, tutorial, life]
tags: string[] (max 5)
series: string?
seriesOrder: number?
cover: image?
coverAlt: string?
draft: boolean (default false)
featured: boolean (default false)
canonicalUrl: url?
```

### 手册 (docs)
```yaml
title: string
description: string?
section: string
order: number (default 0)
draft: boolean (default false)
status: enum [draft, review, published, deprecated]
sidebar: { label?, hidden?, badge? }
tableOfContents: boolean (default true)
editUrl: boolean (default true)
prev: string?
next: string?
```

## 4. 路由策略

| 内容域 | URL 模式 | 示例 |
|--------|----------|------|
| 博客文章 | `/blog/{slug}` | `/blog/astro-guide` |
| 博客标签 | `/blog/tags/{tag}` | `/blog/tags/astro` |
| 博客分类 | `/blog/categories/{cat}` | `/blog/categories/tech` |
| 博客系列 | `/blog/series/{name}` | `/blog/series/astro-in-action` |
| 手册文档 | `/docs/{section}/{page}` | `/docs/getting-started/quick-start` |
| 工具箱 | `/tools/{name}` | V1+ 预留 |
| 个人名片 | `/about` | 静态页面 |
| RSS | `/rss.xml` | 标准路径 |

## 5. 设计规范

- **视觉气质**：文档化/知识库风格，高信息密度
- **主色调**：深蓝 `#1A56DB` + 天蓝 `#0EA5E9`
- **内容域色彩**：博客橙 `#F97316`、手册蓝 `#3B82F6`、工具箱绿 `#22C55E`
- **字体**：正文 Arial / Noto Sans SC，代码 JetBrains Mono
- **字号**：正文 16px，H1 32px，H2 24px，H3 20px
- **行高**：正文 1.8（中文优化），标题 1.4，代码 1.5
- **断点**：Mobile <768px, Tablet 768-1024px, Desktop 1024-1440px, Wide >1440px
- **暗色模式**：CSS 变量 + `prefers-color-scheme` + 手动切换持久化

## 6. V0 MVP 任务分解

| # | 任务 | 工时 | 依赖 |
|---|------|------|------|
| T1 | 项目初始化与基础配置 | 4h | - |
| T2 | 设计系统与全局样式 | 6h | T1 |
| T3 | Content Collections Schema 定义 | 3h | T1 |
| T4 | BaseLayout + 通用组件 (Header/Footer/Theme/SEO/Breadcrumb) | 8h | T2 |
| T5 | Markdown 排版与代码高亮 | 5h | T2 |
| T6 | 博客列表页 + 详情页 | 10h | T3, T4, T5 |
| T7 | 手册布局 + 侧边栏导航 | 12h | T3, T4, T5 |
| T8 | 首页设计与实现 | 6h | T4, T6 |
| T9 | 404 页面 | 2h | T4 |
| T10 | 分类/标签/系列页 | 8h | T3, T6 |
| T11 | RSS + Sitemap + robots.txt + 基础 SEO | 4h | T3 |
| T12 | 本地搜索 (Fuse.js) | 6h | T3, T4 |
| T13 | 部署流水线 (GitHub Actions + Cloudflare Pages) | 4h | T1 |
| T14 | 种子内容 + 全站联调 | 8h | T6-T12 |

**总工时：~86h / 3 周**

### 时间线

```
Week 1: 基础设施           Week 2: 核心页面          Week 3: 功能 + 联调
─────────────────         ─────────────────         ─────────────────
T1 项目初始化              T6 博客页面               T10 分类/标签/系列
T2 设计系统                T7 手册布局               T12 本地搜索
T3 Content Schema          T8 首页                   T11 RSS/Sitemap/SEO
T4 Layout + 通用组件       T9 404 页面               T14 种子内容 + 联调
T5 Markdown 排版
T13 部署流水线
```

## 7. 关键决策

### 域名暂空处理
- `astro.config.mjs` 中 `site` 使用环境变量 `SITE_URL`
- 默认值为 Cloudflare Pages 的 `*.pages.dev` 临时域名
- 域名确定后仅改环境变量，零代码改动
- 正式域名确定前不提交 Google Search Console

### 中文 SEO 要点
- `<html lang="zh-CN">`
- Title 控制 25-30 中文字符
- Description 控制 80-100 中文字符
- URL slug 使用英文/拼音（不用中文编码）
- 阅读时间按 300 字/分钟计算
- 中英文之间加空格

## 8. 迭代路线

- **V0 MVP**（本期）：博客+手册双内容域、基础主题、本地搜索、SEO 基建、Git 自动部署
- **V1 增强**：Algolia DocSearch、giscus 评论、结构化数据增强、性能基线、断链检查
- **V2 智能化**：AI 摘要/标签生成、语义搜索/站内问答、评论审核、个性化推荐
