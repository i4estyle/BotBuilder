<template>
  <q-layout view="hHh Lpr fFf" class="admin-layout-root">
    <q-drawer
      v-model="isDrawerOpen"
      :mini="isDrawerMini && !$q.screen.lt.md"
      :mini-width="72"
      :width="264"
      :breakpoint="1024"
      show-if-above
      bordered
      class="admin-app-nav"
      :class="{ 'admin-app-nav--mini': isDrawerMini && !$q.screen.lt.md }"
    >
      <aside class="admin-app-nav__content" aria-label="เมนูผู้ดูแลระบบ">
        <div class="admin-app-nav__brand">
          <img :src="logo" alt="BotBuilder" class="admin-app-nav__logo" />
          <div v-show="!isDrawerMini || $q.screen.lt.md" class="admin-app-nav__brand-text">
            <div class="admin-app-nav__product-name">BotBuilder</div>
            <div class="admin-app-nav__product-type">ผู้ดูแลระบบ</div>
          </div>
          <q-tooltip
            v-if="isDrawerMini && !$q.screen.lt.md"
            anchor="center right"
            self="center left"
            :offset="[14, 0]"
            class="admin-app-nav__tooltip"
          >
            BotBuilder ผู้ดูแลระบบ
          </q-tooltip>
        </div>

        <q-list padding class="admin-app-nav__menu">
          <div v-show="!isDrawerMini || $q.screen.lt.md" class="admin-app-nav__section-label">
            การจัดการระบบ
          </div>
          <q-item
            v-for="item in navigationItems"
            :key="item.to"
            clickable
            :to="item.to"
            active-class="admin-app-nav__item--active"
            class="admin-app-nav__item"
            @click="closeDrawerOnMobile"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" size="21px" />
            </q-item-section>
            <q-item-section v-show="!isDrawerMini || $q.screen.lt.md">
              {{ item.label }}
            </q-item-section>
            <q-tooltip
              v-if="isDrawerMini && !$q.screen.lt.md"
              anchor="center right"
              self="center left"
              :offset="[14, 0]"
              class="admin-app-nav__tooltip"
            >
              {{ item.label }}
            </q-tooltip>
          </q-item>
        </q-list>

        <div class="admin-app-nav__footer">
          <div
            class="admin-app-nav__user"
            :class="{ 'admin-app-nav__user--mini': isDrawerMini && !$q.screen.lt.md }"
          >
            <q-avatar color="primary" text-color="white" size="36px">
              {{ userInitial }}
            </q-avatar>
            <div v-show="!isDrawerMini || $q.screen.lt.md" class="admin-app-nav__user-details">
              <div class="admin-app-nav__user-name">
                {{ authStore.user?.displayName || 'ผู้ดูแลระบบ' }}
              </div>
              <div class="admin-app-nav__user-email">{{ authStore.user?.email || 'Admin' }}</div>
            </div>
            <q-btn flat round dense icon="logout" aria-label="ออกจากระบบ" @click="logout">
              <q-tooltip anchor="center right" self="center left" :offset="[14, 0]">
                ออกจากระบบ
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </aside>
    </q-drawer>

    <q-btn
      v-show="!isDrawerOpen && route.name !== 'admin-website'"
      round
      unelevated
      icon="menu"
      color="primary"
      class="admin-app-nav__mobile-toggle"
      aria-label="เปิดเมนูผู้ดูแลระบบ"
      @click="isDrawerOpen = true"
    />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth-store';
import { useAdminDrawer } from '@/composables/use-admin-drawer';
import logo from '@/assets/landing/logo.png';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { isDrawerOpen, isDrawerMini } = useAdminDrawer();

const navigationItems = [
  { label: 'จัดการเว็บไซต์', icon: 'language', to: '/admin/website' },
  { label: 'การประเมินผล', icon: 'assignment_turned_in', to: '/admin/evaluations' },
  { label: 'รายงาน', icon: 'analytics', to: '/admin/report' },
  { label: 'บัญชีผู้ดูแล', icon: 'manage_accounts', to: '/admin/users' },
];

const userInitial = computed((): string => authStore.user?.displayName?.trim().charAt(0) || 'A');

function closeDrawerOnMobile(): void {
  if ($q.screen.lt.lg) isDrawerOpen.value = false;
}

async function logout(): Promise<void> {
  await authStore.logout();
  await router.replace('/admin/login');
}
</script>
