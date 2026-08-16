<template>
  <footer class="site-footer">
    <div>
      <h2 :style="getStyleOverride('footer.brandTitle')">
        {{ footerData.brandTitle || 'BOT BUILDER' }}
      </h2>
      <p :style="getStyleOverride('footer.brandText')">
        {{
          footerData.brandText ||
          'ศูนย์การเรียนรู้หุ่นยนต์และนวัตกรรมสำหรับเด็ก ที่เชื่อว่าการเรียนรู้ที่ดีที่สุดคือการสร้างสรรค์ด้วยมือของตัวเอง'
        }}
      </p>
    </div>
    <div>
      <h3 :style="getStyleOverride('footer.quickLinks')">
        {{ footerData.quickLinks || 'ลิงก์ด่วน' }}
      </h3>
      <RouterLink to="/courses" :style="getStyleOverride('footer.courses')">{{
        footerData.courses || 'คอร์สเรียน'
      }}</RouterLink>
      <RouterLink to="/about-us" :style="getStyleOverride('footer.aboutUs')">{{
        footerData.aboutUs || 'เกี่ยวกับเรา'
      }}</RouterLink>
      <RouterLink to="/resources" :style="getStyleOverride('footer.resources')">{{
        footerData.resources || 'คลังความรู้'
      }}</RouterLink>
    </div>
    <div>
      <h3 :style="getStyleOverride('footer.support')">{{ footerData.support || 'ช่วยเหลือ' }}</h3>
      <RouterLink to="/promotions" :style="getStyleOverride('footer.promotion')">{{
        footerData.promotion || 'โปรโมชั่น'
      }}</RouterLink>
      <a href="mailto:hello@botbuilder.co.th">hello@botbuilder.co.th</a>
    </div>
    <p class="site-footer__copyright" :style="getStyleOverride('footer.copyright')">
      {{ footerData.copyright || '© 2024 Bot Builder Academy. Built for future engineers.' }}
    </p>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useWebsiteEditor } from '@/composables/use-website-editor';

const { footer: footerData, getStyleOverride } = useWebsiteEditor();
</script>
