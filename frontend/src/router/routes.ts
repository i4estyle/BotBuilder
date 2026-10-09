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
      { path: 'second', component: () => import('@/pages/SecondPage.vue') },
      { path: 'evaluations', component: () => import('@/pages/EvaluationDashboardPage.vue') },
      { path: 'report', component: () => import('@/pages/admin-report-page.vue') },
    ],
  },
  {
    path: '/login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { guestOnly: true },
  },
  { path: '/register', component: () => import('@/pages/RegisterPage.vue'), meta: { guestOnly: true } },
  { path: '/forgot-password', component: () => import('@/pages/ForgotPasswordPage.vue'), meta: { guestOnly: true } },
  { path: '/reset-password', component: () => import('@/pages/ResetPasswordPage.vue'), meta: { guestOnly: true } },
  { path: '/verify-email', component: () => import('@/pages/VerifyEmailPage.vue'), meta: { guestOnly: true } },
  { path: '/account/password', component: () => import('@/pages/ChangePasswordPage.vue'), meta: { requiresAuth: true } },
  {
    path: '/admin',
    component: () => import('@/layouts/admin-layout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', redirect: '/admin/website' },
      {
        path: 'website',
        component: () => import('@/pages/admin-website-page.vue'),
      },
      {
        path: 'evaluations',
        component: () => import('@/pages/EvaluationDashboardPage.vue'),
      },
      {
        path: 'report',
        component: () => import('@/pages/admin-report-page.vue'),
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
];

export default routes;
