import { reactive } from 'vue';

export interface StyleOverrideItem {
  fontSizePx?: number;
  textColor?: string;
  isBold?: boolean;
  isItalic?: boolean;
  transformX?: number;
  transformY?: number;
  width?: string;
  height?: string;
  display?: string;
}

export const styleOverrides = reactive<Record<string, StyleOverrideItem>>({});

export function getStyleOverride(key: string): Record<string, string | undefined> {
  const s = styleOverrides[key];
  if (!s) return {};
  const styleObj: Record<string, string | undefined> = {};
  if (s.fontSizePx) styleObj.fontSize = `${s.fontSizePx}px`;
  if (s.textColor) styleObj.color = s.textColor;
  if (s.isBold !== undefined) styleObj.fontWeight = s.isBold ? '700' : '400';
  if (s.isItalic !== undefined) styleObj.fontStyle = s.isItalic ? 'italic' : 'normal';
  if (s.transformX !== undefined || s.transformY !== undefined) {
    const x = s.transformX || 0;
    const y = s.transformY || 0;
    if (x !== 0 || y !== 0) {
      styleObj.transform = `translate(${x}px, ${y}px)`;
      styleObj.display = s.display || 'inline-block';
    }
  }
  if (s.width) styleObj.width = s.width;
  if (s.height) styleObj.height = s.height;
  if (s.display) styleObj.display = s.display;
  return styleObj;
}

export function setStyleOverride(key: string, patch: Partial<StyleOverrideItem>): void {
  if (!key) return;
  if (!styleOverrides[key]) {
    styleOverrides[key] = {};
  }
  Object.assign(styleOverrides[key], patch);
}

export function removeStyleOverride(key: string): void {
  delete styleOverrides[key];
}

export function clearStyleOverrides(): void {
  for (const key of Object.keys(styleOverrides)) {
    delete styleOverrides[key];
  }
}

export function clearPageStyleOverrides(preserveShared = true): void {
  for (const key of Object.keys(styleOverrides)) {
    if (preserveShared && (key.startsWith('header.') || key.startsWith('footer.'))) {
      continue;
    }
    delete styleOverrides[key];
  }
}
