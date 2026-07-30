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
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
];

export default routes;
