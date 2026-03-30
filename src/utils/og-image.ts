import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, existsSync } from 'node:fs';

/**
 * Load fonts for OG image generation.
 * Strategy:
 * 1. Try local system CJK fonts (Windows: SimHei, macOS: PingFang, Linux: Noto Sans CJK)
 * 2. Fallback to bundled font file if exists
 * 3. Fetch from network as last resort
 */

const SYSTEM_FONTS = [
  // Windows
  'C:/Windows/Fonts/simhei.ttf',
  'C:/Windows/Fonts/msyhbd.ttc',
  // macOS
  '/System/Library/Fonts/PingFang.ttc',
  '/System/Library/Fonts/STHeiti Light.ttc',
  // Linux
  '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',
  '/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc',
];

let fontsCache: { name: string; data: ArrayBuffer; weight: number; style: string }[] | null = null;

function loadLocalFont(): ArrayBuffer | null {
  for (const fontPath of SYSTEM_FONTS) {
    try {
      if (existsSync(fontPath)) {
        const buffer = readFileSync(fontPath);
        return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
      }
    } catch {
      continue;
    }
  }
  return null;
}

async function getFonts() {
  if (fontsCache) return fontsCache;

  const localFont = loadLocalFont();
  if (localFont) {
    fontsCache = [
      { name: 'CJK Font', data: localFont, weight: 400, style: 'normal' },
      { name: 'CJK Font', data: localFont, weight: 700, style: 'normal' },
    ];
    return fontsCache;
  }

  // Network fallback: use a small latin-only font (satori needs at least one)
  try {
    const res = await fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/files/inter-latin-400-normal.woff');
    if (res.ok) {
      const data = await res.arrayBuffer();
      fontsCache = [
        { name: 'Inter', data, weight: 400, style: 'normal' },
      ];
      return fontsCache;
    }
  } catch { /* ignore */ }

  throw new Error('Cannot load any fonts for OG image generation');
}

export async function generateOgImage({
  title,
  description,
  category,
  siteName = '个人博客 & PRD 手册',
}: {
  title: string;
  description?: string;
  category?: string;
  siteName?: string;
}): Promise<Buffer> {
  const fonts = await getFonts();
  const fontFamily = fonts[0].name === 'CJK Font'
    ? '"CJK Font", sans-serif'
    : '"Inter", sans-serif';

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          padding: '60px 80px',
          fontFamily,
          color: '#f8fafc',
        },
        children: [
          // Top bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '40px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '48px',
                      height: '4px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '2px',
                    },
                  },
                },
                ...(category ? [{
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: '#94a3b8',
                      letterSpacing: '2px',
                    },
                    children: category,
                  },
                }] : []),
              ],
            },
          },
          // Title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: '1',
                alignItems: 'center',
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    fontSize: title.length > 30 ? '48px' : '56px',
                    fontWeight: 700,
                    lineHeight: 1.3,
                    letterSpacing: '-0.02em',
                    color: '#f1f5f9',
                  },
                  children: title,
                },
              },
            },
          },
          // Description
          ...(description ? [{
            type: 'div',
            props: {
              style: {
                fontSize: '24px',
                color: '#94a3b8',
                lineHeight: 1.5,
                marginBottom: '40px',
              },
              children: description.length > 80 ? description.slice(0, 80) + '...' : description,
            },
          }] : []),
          // Bottom bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #334155',
                paddingTop: '24px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '22px',
                      fontWeight: 600,
                      color: '#3b82f6',
                    },
                    children: siteName,
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: '#64748b',
                    },
                    children: 'aichichips.shop',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: fonts as any,
    },
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });
  const pngData = resvg.render();
  return Buffer.from(pngData.asPng());
}
