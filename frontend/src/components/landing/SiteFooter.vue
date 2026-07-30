<template>
  <footer class="site-footer">
    <div>
      <h2>BOT BUILDER</h2>
      <p>
        ศูนย์การเรียนรู้หุ่นยนต์และนวัตกรรมสำหรับเด็ก
        ที่เชื่อว่าการเรียนรู้ที่ดีที่สุดคือการสร้างสรรค์ด้วยมือของตัวเอง
      </p>
    </div>
    <div>
      <h3>QUICK LINKS</h3>
      <RouterLink to="/courses">Courses</RouterLink>
      <RouterLink to="/about-us">About Us</RouterLink>
      <RouterLink to="/resources">Resources</RouterLink>
    </div>
    <div>
      <h3>SUPPORT</h3>
      <RouterLink to="/promotions">Promotion</RouterLink>
      <a href="mailto:hello@botbuilder.co.th">Contact us</a>
    </div>
    <p class="site-footer__copyright">© 2024 Bot Builder Academy. Built for future engineers.</p>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
