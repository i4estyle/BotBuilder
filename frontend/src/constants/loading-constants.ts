import loadingLogo from '@/assets/landing/logo.png';
import type { LoadingConfig } from '@/types/loading.types';

export const APP_CONTENT_READY_EVENT = 'botbuilder:content-ready';
export const APP_LOADING_COMPLETE_EVENT = 'botbuilder:loading-complete';

export const LOADING_CONFIG: LoadingConfig = {
  title: 'BotBuilder',
  badgeTextTh: 'สถาบันหุ่นยนต์และการเขียนโปรแกรม',
  badgeTextEn: 'Robotics & Programming',
  minDurationMs: 650,
  maxTimeoutMs: 4500,
  completionDurationMs: 420,
  fadeDurationMs: 480,
  waitingProgress: 94,
  contentRoutes: ['/', '/promotions', '/courses', '/resources', '/about-us'],
  logoAssetKey: loadingLogo,
  theme: {
    backdropColor: '#ffffff',
    cardBackground: 'rgba(255, 255, 255, 0.98)',
    barTrackColor: '#e9efec',
    barFillGradient: 'linear-gradient(90deg, #e51f3b 0%, #f04452 40%, #20b776 70%, #009b58 100%)',
    barGlow: 'rgba(229, 31, 59, 0.2)',
    waveRed: '#e51f3b',
    waveGreen: '#009b58',
    textPrimary: '#46565a',
    textSecondary: '#687976',
    badgeBg: '#fef2f2',
    badgeText: '#bc0100',
    badgeBorder: '#fee2e2',
  },
  steps: [
    {
      threshold: 25,
      labelTh: 'กำลังเชื่อมต่อระบบ...',
      labelEn: 'Connecting to system...',
    },
    {
      threshold: 65,
      labelTh: 'กำลังเตรียมข้อมูลหลักสูตรและกิจกรรม...',
      labelEn: 'Loading courses and activities...',
    },
    {
      threshold: 90,
      labelTh: 'กำลังจัดเตรียมเนื้อหาหน้าเว็บ...',
      labelEn: 'Preparing website content...',
    },
    {
      threshold: 100,
      labelTh: 'พร้อมเข้าสู่เว็บไซต์',
      labelEn: 'Welcome to website',
    },
  ],
} as const;
