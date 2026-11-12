import type { LoadingConfig } from '@/types/loading.types';

export const LOADING_CONFIG: LoadingConfig = {
  title: 'BotBuilder Website',
  badgeTextTh: 'สถาบันหุ่นยนต์และการเขียนโปรแกรม',
  badgeTextEn: 'Robotics & Programming',
  minDurationMs: 1100,
  maxTimeoutMs: 2800,
  frameIntervalMs: 16,
  logoAssetKey: 'logo.png',
  theme: {
    backdropColor: '#ffffff',
    cardBackground: 'rgba(255, 255, 255, 0.98)',
    barTrackColor: '#e9ecef',
    barFillGradient: 'linear-gradient(90deg, #bc0100 0%, #ef233c 55%, #1c871e 100%)',
    barGlow: 'rgba(239, 35, 60, 0.3)',
    textPrimary: '#1a202c',
    textSecondary: '#006c0c',
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
