<template>
  <q-layout view="hHh Lpr fFf" class="admin-layout-root">
    <q-drawer
      v-model="drawerOpen"
      :width="264"
      :breakpoint="1024"
      show-if-above
      bordered
      class="admin-app-nav"
    >
      <aside class="admin-app-nav__content" aria-label="เมนูผู้ดูแลระบบ">
        <div class="admin-app-nav__brand">
          <img :src="logo" alt="BotBuilder" class="admin-app-nav__logo" />
          <div>
            <div class="admin-app-nav__product-name">BotBuilder</div>
            <div class="admin-app-nav__product-type">ผู้ดูแลระบบ</div>
          </div>
        </div>

        <q-list padding class="admin-app-nav__menu">
          <div class="admin-app-nav__section-label">การจัดการระบบ</div>
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
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>
        </q-list>

        <div class="admin-app-nav__footer">
          <q-btn
            flat
            no-caps
            icon="open_in_new"
            label="ดูหน้าเว็บไซต์"
            to="/home"
            class="admin-app-nav__website-link full-width"
            @click="closeDrawerOnMobile"
          />

          <div class="admin-app-nav__user">
            <q-avatar color="primary" text-color="white" size="38px">
              {{ userInitial }}
            </q-avatar>
            <div class="admin-app-nav__user-details">
              <div class="admin-app-nav__user-name">
                {{ authStore.user?.displayName || 'ผู้ดูแลระบบ' }}
              </div>
              <div class="admin-app-nav__user-email">{{ authStore.user?.email || 'Admin' }}</div>
            </div>
            <q-btn flat round dense icon="logout" aria-label="ออกจากระบบ" @click="logout">
              <q-tooltip>ออกจากระบบ</q-tooltip>
            </q-btn>
          </div>
        </div>
      </aside>
    </q-drawer>

    <q-btn
      v-show="$q.screen.lt.lg"
      round
      unelevated
      icon="menu"
      color="primary"
      class="admin-app-nav__mobile-toggle"
      aria-label="เปิดเมนูผู้ดูแลระบบ"
      @click="drawerOpen = true"
    />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth-store';
import logo from '@/assets/landing/logo.png';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const drawerOpen = ref(false);

const navigationItems = [
  { label: 'จัดการเว็บไซต์', icon: 'language', to: '/admin/website' },
  { label: 'การประเมินผล', icon: 'assignment_turned_in', to: '/admin/evaluations' },
  { label: 'รายงาน', icon: 'analytics', to: '/admin/report' },
  { label: 'บัญชีผู้ดูแล', icon: 'manage_accounts', to: '/admin/users' },
];

const userInitial = computed(() => authStore.user?.displayName?.trim().charAt(0) || 'A');

function closeDrawerOnMobile(): void {
  if ($q.screen.lt.lg) drawerOpen.value = false;
}

async function logout(): Promise<void> {
  await authStore.logout();
  await router.replace('/admin/login');
}
</script>
