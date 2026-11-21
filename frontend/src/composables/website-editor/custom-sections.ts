import type { CustomBlockItem, CustomSectionCard, CustomSectionLayout } from './types';

export interface CustomSectionTemplate {
  layout: CustomSectionLayout;
  label: string;
  description: string;
  icon: string;
}

export const CUSTOM_SECTION_TEMPLATES: CustomSectionTemplate[] = [
  {
    layout: 'text',
    label: 'ข้อความ',
    description: 'หัวข้อและย่อหน้าข้อความ',
    icon: 'notes',
  },
  {
    layout: 'imageText',
    label: 'รูปภาพคู่ข้อความ',
    description: 'รูปภาพด้านหนึ่ง ข้อความอีกด้าน',
    icon: 'vertical_split',
  },
  {
    layout: 'image',
    label: 'รูปภาพใหญ่',
    description: 'หัวข้อและรูปภาพเต็มความกว้าง',
    icon: 'image',
  },
  {
    layout: 'cards',
    label: 'การ์ดจุดเด่น',
    description: 'การ์ดไอคอน 3 ใบ เพิ่ม/ลบได้',
    icon: 'view_module',
  },
  {
    layout: 'cta',
    label: 'ปุ่มชวนติดต่อ',
    description: 'ข้อความเชิญชวนพร้อมปุ่มลิงก์',
    icon: 'ads_click',
  },
];

export const CUSTOM_SECTION_PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';

export const MAX_CUSTOM_SECTION_CARDS = 6;

export function createDefaultCard(index = 0): CustomSectionCard {
  return {
    icon:
      ['star', 'lightbulb', 'emoji_events', 'groups', 'rocket_launch', 'favorite'][index % 6] ||
      'star',
    title: `หัวข้อที่ ${index + 1}`,
    text: 'อธิบายรายละเอียดสั้น ๆ ตรงนี้',
  };
}

export function getCustomSectionIcon(layout: CustomSectionLayout): string {
  return CUSTOM_SECTION_TEMPLATES.find((t) => t.layout === layout)?.icon || 'article';
}

export function createCustomSection(id: string, layout: CustomSectionLayout): CustomBlockItem {
  switch (layout) {
    case 'image':
      return {
        id,
        type: 'image',
        title: 'หัวข้อรูปภาพ',
        image: CUSTOM_SECTION_PLACEHOLDER_IMAGE,
        background: 'white',
      };
    case 'imageText':
      return {
        id,
        type: 'imageText',
        title: 'หัวข้อใหม่',
        content:
          'เล่ารายละเอียดของหัวข้อนี้ คลิกที่ข้อความเพื่อแก้ไข และคลิกที่รูปเพื่อเปลี่ยนรูปภาพ',
        image: CUSTOM_SECTION_PLACEHOLDER_IMAGE,
        imagePosition: 'left',
        background: 'white',
      };
    case 'cards':
      return {
        id,
        type: 'cards',
        title: 'จุดเด่นของเรา',
        content: 'คำอธิบายสั้น ๆ ใต้หัวข้อ',
        items: [createDefaultCard(0), createDefaultCard(1), createDefaultCard(2)],
        background: 'soft',
      };
    case 'cta':
      return {
        id,
        type: 'cta',
        title: 'พร้อมเริ่มต้นแล้วหรือยัง?',
        content: 'ติดต่อเราเพื่อสอบถามรายละเอียดหรือจองรอบทดลองเรียน',
        buttonLabel: 'ติดต่อเรา',
        buttonUrl: 'https://line.me/R/ti/p/@botbuilderthailand',
        background: 'brand',
      };
    case 'text':
    default:
      return {
        id,
        type: 'text',
        title: 'หัวข้อใหม่',
        content: 'พิมพ์เนื้อหาของส่วนนี้ คลิกที่ข้อความเพื่อแก้ไขได้โดยตรง',
        background: 'white',
      };
  }
}

/** Only allow http(s), mailto, tel and in-site links for custom buttons. */
export function sanitizeButtonUrl(url: string | undefined): string {
  const value = (url || '').trim();
  if (!value) return '';
  if (/^(https?:|mailto:|tel:)/i.test(value) || value.startsWith('/') || value.startsWith('#')) {
    return value;
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return '';
  return `https://${value}`;
}
