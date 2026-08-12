<template>
  <footer class="site-footer">
    <div>
      <h2>{{ t('common.footer.brandTitle') }}</h2>
      <p>{{ t('common.footer.brandText') }}</p>
    </div>
    <div>
      <h3>{{ t('common.footer.quickLinks') }}</h3>
      <RouterLink to="/courses">{{ t('common.footer.courses') }}</RouterLink>
      <RouterLink to="/about-us">{{ t('common.footer.aboutUs') }}</RouterLink>
      <RouterLink to="/resources">{{ t('common.footer.resources') }}</RouterLink>
    </div>
    <div>
      <h3>{{ t('common.footer.support') }}</h3>
      <RouterLink to="/promotions">{{ t('common.footer.promotion') }}</RouterLink>
      <a href="mailto:hello@botbuilder.co.th">{{ t('common.footer.contactUs') }}</a>
    </div>
    <p class="site-footer__copyright">{{ t('common.footer.copyright') }}</p>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
