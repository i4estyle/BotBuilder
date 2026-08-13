import { sectionBlocks, ghostBlockType, activeSectionId, selectedBlockId } from './state';
import { saveHistorySnapshot } from './history';
import type { SectionBlockItem } from './types';

export function getNextZIndex(sectionId: string): number {
  const blocks = sectionBlocks.filter((b) => b.sectionId === sectionId);
  if (blocks.length === 0) return 1;
  return Math.max(...blocks.map((b) => b.zIndex)) + 1;
}

export function addBlockToSection(
  sectionId: string,
  blockType: 'text' | 'image' | 'icon' | 'shape',
): string {
  saveHistorySnapshot();
  const blockId = `sblock-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const existingCount = sectionBlocks.filter((b) => b.sectionId === sectionId).length;
  const offsetX = 5 + (existingCount % 5) * 5;
  const offsetY = 5 + (existingCount % 5) * 5;

  const defaultW =
    blockType === 'text' ? 35 : blockType === 'image' ? 30 : blockType === 'shape' ? 25 : 8;
  const defaultH =
    blockType === 'text' ? 0 : blockType === 'image' ? 120 : blockType === 'shape' ? 100 : 50;

  const newBlock: SectionBlockItem = {
    id: blockId,
    sectionId,
    type: blockType,
    x: offsetX,
    y: offsetY,
    w: defaultW,
    h: defaultH,
    zIndex: blockType === 'shape' ? 2 : getNextZIndex(sectionId),
  };

  if (blockType === 'text') {
    newBlock.content = 'พิมพ์ข้อความเนื้อหาอิสระเพิ่มเติมตรงนี้...';
  } else if (blockType === 'image') {
    newBlock.image =
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
  } else if (blockType === 'icon') {
    newBlock.iconName = 'star';
    newBlock.iconColor = '#0284c7';
  } else if (blockType === 'shape') {
    newBlock.shapeType = 'rounded';
    newBlock.bgColor = '#f1f5f9';
    newBlock.borderColor = '#cbd5e1';
  }

  sectionBlocks.push(newBlock);
  activeSectionId.value = sectionId;
  selectedBlockId.value = blockId;
  return blockId;
}

export function startPlacingBlock(type: 'text' | 'image' | 'icon' | 'shape'): void {
  ghostBlockType.value = type;
}

export function cancelPlacingBlock(): void {
  ghostBlockType.value = null;
}

export function dropBlockAtSection(
  sectionId: string,
  blockType: 'text' | 'image' | 'icon' | 'shape',
  pctX: number,
  pctY: number,
): string {
  saveHistorySnapshot();
  const blockId = `sblock-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const defaultW =
    blockType === 'text' ? 35 : blockType === 'image' ? 30 : blockType === 'shape' ? 25 : 8;
  const defaultH =
    blockType === 'text' ? 0 : blockType === 'image' ? 120 : blockType === 'shape' ? 100 : 50;

  const clampedX = Math.max(0, Math.min(100 - defaultW, pctX));
  const clampedY = Math.max(0, Math.min(95, pctY));

  const newBlock: SectionBlockItem = {
    id: blockId,
    sectionId,
    type: blockType,
    x: Math.round(clampedX * 10) / 10,
    y: Math.round(clampedY * 10) / 10,
    w: defaultW,
    h: defaultH,
    zIndex: blockType === 'shape' ? 2 : getNextZIndex(sectionId),
  };

  if (blockType === 'text') {
    newBlock.content = 'พิมพ์ข้อความเนื้อหาอิสระเพิ่มเติมตรงนี้...';
  } else if (blockType === 'image') {
    newBlock.image =
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
  } else if (blockType === 'icon') {
    newBlock.iconName = 'star';
    newBlock.iconColor = '#0284c7';
  } else if (blockType === 'shape') {
    newBlock.shapeType = 'rounded';
    newBlock.bgColor = '#f1f5f9';
    newBlock.borderColor = '#cbd5e1';
  }

  sectionBlocks.push(newBlock);
  activeSectionId.value = sectionId;
  selectedBlockId.value = blockId;
  ghostBlockType.value = null;
  return blockId;
}

export function removeSectionBlock(blockId: string): void {
  saveHistorySnapshot();
  const index = sectionBlocks.findIndex((b) => b.id === blockId);
  if (index !== -1) {
    sectionBlocks.splice(index, 1);
  }
  if (selectedBlockId.value === blockId) {
    selectedBlockId.value = '';
  }
}

export function getSectionBlocks(sectionId: string): SectionBlockItem[] {
  return sectionBlocks.filter((b) => b.sectionId === sectionId);
}

export function updateBlockPosition(blockId: string, x: number, y: number): void {
  const block = sectionBlocks.find((b) => b.id === blockId);
  if (block) {
    block.x = Math.max(0, Math.min(100, x));
    block.y = Math.max(0, y);
  }
}

export function updateBlockSize(blockId: string, w: number, h: number): void {
  const block = sectionBlocks.find((b) => b.id === blockId);
  if (block) {
    block.w = Math.max(5, Math.min(100, w));
    block.h = Math.max(3, h);
  }
}

export function bringToFront(blockId: string): void {
  const block = sectionBlocks.find((b) => b.id === blockId);
  if (block) {
    block.zIndex = getNextZIndex(block.sectionId);
  }
}

export function sendToBack(blockId: string): void {
  const block = sectionBlocks.find((b) => b.id === blockId);
  if (block) {
    const siblings = sectionBlocks.filter((b) => b.sectionId === block.sectionId);
    const minZ = Math.min(...siblings.map((b) => b.zIndex));
    block.zIndex = minZ - 1;
  }
}

export function addCustomTextBlock(): void {
  const targetId = activeSectionId.value || 'hero';
  addBlockToSection(targetId, 'text');
}

export function addCustomImageBlock(imgUrl?: string): void {
  const targetId = activeSectionId.value || 'hero';
  const blockId = addBlockToSection(targetId, 'image');
  if (imgUrl) {
    const b = sectionBlocks.find((item) => item.id === blockId);
    if (b) b.image = imgUrl;
  }
}

export function addCustomIconBlock(iconName?: string): void {
  const targetId = activeSectionId.value || 'hero';
  const blockId = addBlockToSection(targetId, 'icon');
  if (iconName) {
    const b = sectionBlocks.find((item) => item.id === blockId);
    if (b) b.iconName = iconName;
  }
}
