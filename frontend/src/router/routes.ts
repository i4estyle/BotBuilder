import type { RouteRecordRaw } from 'vue-router';
import seoConfig from '../../seo-pages.json';

function publicSeo(path: string) {
  const page = seoConfig.pages.find((item) => item.path === path);
  if (!page) throw new Error(`Missing SEO configuration for ${path}`);
  return { ...page, canonicalPath: page.path };
}

const noIndexSeo = {
  title: 'BotBuilder Admin',
  description: 'BotBuilder administration area',
  robots: 'noindex, nofollow, noarchive',
};

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/IndexPage.vue'),
        meta: {
          seo: publicSeo('/'),
        },
      },
      { path: 'home', redirect: { name: 'home' } },
      {
        path: 'promotions',
        name: 'promotions',
        component: () => import('@/pages/PromotionsPage.vue'),
        meta: {
          seo: publicSeo('/promotions'),
        },
      },
      {
        path: 'courses',
        name: 'courses',
        component: () => import('@/pages/CoursesPage.vue'),
        meta: {
          seo: publicSeo('/courses'),
        },
      },
      {
        path: 'resources',
        name: 'resources',
        component: () => import('@/pages/ResourcesPage.vue'),
        meta: {
          seo: publicSeo('/resources'),
        },
      },
      {
        path: 'about-us',
        name: 'about-us',
        component: () => import('@/pages/AboutPage.vue'),
        meta: {
          seo: publicSeo('/about-us'),
        },
      },
    ],
  },
  {
    path: '/admin/login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { guestOnly: true, seo: { ...noIndexSeo, title: 'เข้าสู่ระบบ | BotBuilder Admin' } },
  },
  {
    path: '/admin/forgot-password',
    component: () => import('@/pages/ForgotPasswordPage.vue'),
    meta: {
      guestOnly: true,
      seo: { ...noIndexSeo, title: 'ลืมรหัสผ่าน | BotBuilder Admin' },
    },
  },
  {
    path: '/admin/reset-password',
    component: () => import('@/pages/ResetPasswordPage.vue'),
    meta: {
      guestOnly: true,
      seo: { ...noIndexSeo, title: 'ตั้งรหัสผ่านใหม่ | BotBuilder Admin' },
    },
  },
  {
    path: '/admin/change-password',
    component: () => import('@/pages/ChangePasswordPage.vue'),
    meta: {
      requiresAuth: true,
      seo: { ...noIndexSeo, title: 'เปลี่ยนรหัสผ่าน | BotBuilder Admin' },
    },
  },
  {
    path: '/admin',
    component: () => import('@/layouts/admin-layout.vue'),
    meta: { requiresAuth: true, seo: noIndexSeo },
    children: [
      { path: '', redirect: { name: 'admin-website' } },
      {
        path: 'website',
        name: 'admin-website',
        component: () => import('@/pages/admin-website-page.vue'),
        meta: { title: 'จัดการเว็บไซต์' },
      },
      {
        path: 'evaluations',
        name: 'admin-evaluations',
        component: () => import('@/pages/EvaluationDashboardPage.vue'),
        meta: { title: 'การประเมินผล' },
      },
      {
        path: 'report',
        name: 'admin-report',
        component: () => import('@/pages/admin-report-page.vue'),
        meta: { title: 'รายงาน' },
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/pages/AdminUsersPage.vue'),
        meta: { title: 'บัญชีผู้ดูแล' },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
    meta: {
      seo: {
        title: 'ไม่พบหน้าที่ต้องการ | BotBuilder',
        description: 'ไม่พบหน้าที่คุณกำลังค้นหา',
        robots: 'noindex, nofollow, noarchive',
      },
    },
  },
];

export default routes;
