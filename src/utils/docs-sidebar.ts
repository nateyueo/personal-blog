import { getCollection } from 'astro:content';

export interface SidebarItem {
  title: string;
  slug: string;
  order: number;
  badge?: { text: string; variant: string };
}

export interface SidebarSection {
  name: string;
  label: string;
  items: SidebarItem[];
}

const SECTION_LABELS: Record<string, string> = {
  'getting-started': '快速入门',
  'prd-methodology': 'PRD 方法论',
  'templates': '模板库',
  'best-practices': '最佳实践',
  'api-reference': 'API 参考',
};

const SECTION_ORDER: Record<string, number> = {
  'getting-started': 0,
  'prd-methodology': 1,
  'templates': 2,
  'best-practices': 3,
  'api-reference': 4,
};

export async function getDocsSidebar(): Promise<SidebarSection[]> {
  const docs = await getCollection('docs', ({ data }) => {
    return import.meta.env.PROD ? !data.draft && !data.sidebarHidden : !data.sidebarHidden;
  });

  const sectionMap = new Map<string, SidebarItem[]>();

  for (const doc of docs) {
    const section = doc.data.section;
    if (!sectionMap.has(section)) {
      sectionMap.set(section, []);
    }
    sectionMap.get(section)!.push({
      title: doc.data.sidebarLabel || doc.data.title,
      slug: doc.id,
      order: doc.data.order,
      badge: doc.data.badge,
    });
  }

  const sections: SidebarSection[] = [];
  for (const [name, items] of sectionMap) {
    items.sort((a, b) => a.order - b.order);
    sections.push({
      name,
      label: SECTION_LABELS[name] || name,
      items,
    });
  }

  sections.sort((a, b) => {
    const orderA = SECTION_ORDER[a.name] ?? 999;
    const orderB = SECTION_ORDER[b.name] ?? 999;
    return orderA - orderB;
  });

  return sections;
}
