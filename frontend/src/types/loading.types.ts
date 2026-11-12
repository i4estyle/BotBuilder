export interface LoadingStepConfig {
  threshold: number;
  labelTh: string;
  labelEn: string;
}

export interface LoadingThemeConfig {
  backdropColor: string;
  cardBackground: string;
  barTrackColor: string;
  barFillGradient: string;
  barGlow: string;
  textPrimary: string;
  textSecondary: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export interface LoadingConfig {
  title: string;
  badgeTextTh: string;
  badgeTextEn: string;
  minDurationMs: number;
  maxTimeoutMs: number;
  frameIntervalMs: number;
  logoAssetKey: string;
  theme: LoadingThemeConfig;
  steps: readonly LoadingStepConfig[];
}

export type LoadingPhase = 'idle' | 'loading' | 'completing' | 'done';
