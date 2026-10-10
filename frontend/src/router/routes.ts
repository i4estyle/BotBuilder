import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/home' },
      { path: 'home', component: () => import('@/pages/IndexPage.vue') },
      { path: 'promotions', component: () => import('@/pages/PromotionsPage.vue') },
      { path: 'courses', component: () => import('@/pages/CoursesPage.vue') },
      { path: 'resources', component: () => import('@/pages/ResourcesPage.vue') },
      { path: 'about-us', component: () => import('@/pages/AboutPage.vue') },
    ],
  },
  {
    path: '/admin/login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/admin/forgot-password',
    component: () => import('@/pages/ForgotPasswordPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/admin/reset-password',
    component: () => import('@/pages/ResetPasswordPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/admin/change-password',
    component: () => import('@/pages/ChangePasswordPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    component: () => import('@/layouts/admin-layout.vue'),
    meta: { requiresAuth: true },
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
  },
];

export default routes;
