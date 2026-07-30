<template>
  <header class="site-header">
    <RouterLink to="/home" class="site-header__brand" aria-label="Bot Builder home">
      <img :src="logo" alt="Bot Builder" class="site-header__logo" />
    </RouterLink>

    <nav class="site-header__nav" aria-label="Main navigation">
      <RouterLink to="/home">Home</RouterLink>
      <RouterLink to="/promotions">Promotion</RouterLink>
      <RouterLink to="/courses">Courses</RouterLink>
      <RouterLink to="/resources">Resources</RouterLink>
      <RouterLink to="/about-us">About us</RouterLink>
    </nav>

    <q-btn flat round dense icon="menu" class="site-header__menu" aria-label="Open menu" />
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import logo from '@/assets/landing/logo.png';
</script>
