<template>
  <q-layout view="hHh lpR fFf">
    <AppLoadingScreen />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AppLoadingScreen from '@/components/base/app-loading-screen.vue';
</script>
