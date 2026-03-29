export const SITE = {
  title: '个人博客 & PRD 手册',
  description: '以「PRD 方法论沉淀」为主线的个人站点，涵盖博客、手册、工具箱与个人名片',
  author: 'Creeper',
  lang: 'zh-CN',
  locale: 'zh_CN',
  ogImage: '/og-default.png',
  themeColor: '#1A56DB',
} as const;

export const DOMAIN_COLORS = {
  blog: { primary: '#F97316', label: '博客' },
  docs: { primary: '#3B82F6', label: '手册' },
  tools: { primary: '#22C55E', label: '工具箱' },
} as const;

export const NAV_ITEMS = [
  { label: '首页', href: '/' },
  { label: '手册', href: '/docs/getting-started/introduction' },
  { label: '博客', href: '/blog' },
  { label: '随想', href: '/thoughts' },
  { label: '收藏', href: '/bookmarks' },
  { label: '关于', href: '/about' },
] as const;

export const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com', icon: 'mdi:github' },
] as const;

export const POSTS_PER_PAGE = 10;
export const DOCS_EDIT_URL = 'https://github.com/your-repo/edit/main/src/content/docs/';
