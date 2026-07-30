<template>
  <q-page class="landing-page">
    <SiteHeader />

    <main>
      <section class="hero" id="about">
        <div class="hero__image-frame"><img :src="heroImage" alt="เด็ก ๆ เรียนรู้ผ่าน LEGO" /></div>
        <div class="hero__copy">
          <h1><span>ปั้นฝันวิศวกร</span>ด้วยตัวต่อ LEGO</h1>
          <p>
            ก้าวแรกสู่โลกแห่งเทคโนโลยีผ่านการเรียนรู้ที่สนุกสนานและลงมือทำจริงกับ LEGO Spike Prime
            หลักสูตรที่ออกแบบมาเพื่อเสริมสร้างทักษะการแก้ปัญหาและความคิดสร้างสรรค์สำหรับเด็กยุคใหม่
          </p>
          <AppButton>BOOK YOUR FREE TRIAL</AppButton>
        </div>
      </section>

      <section class="benefits section section--muted">
        <SectionHeading title="ทำไมต้องเรียนกับเรา?" />
        <div class="benefits__grid">
          <article v-for="benefit in benefits" :key="benefit.title" class="benefit-card">
            <q-icon :name="benefit.icon" />
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.text }}</p>
          </article>
        </div>
      </section>

      <section class="section" id="courses">
        <SectionHeading title="หลักสูตรของเรา" />
        <div class="courses-grid">
          <CourseCard v-for="course in courses" :key="course.title" v-bind="course" />
        </div>
      </section>

      <section class="gallery section section--muted" id="gallery">
        <div class="gallery__copy">
          <SectionHeading title="ผลงานและประกาศนียบัตร" :centered="false" />
          <p>
            เด็ก ๆ ได้สร้างผลงานที่เป็นเอกลักษณ์และภาคภูมิใจ
            พร้อมรับประกาศนียบัตรเพื่อยืนยันการเรียนรู้ในทุกระดับ
          </p>
          <div class="gallery__stats">
            <span><q-icon name="verified" /> Course Certified</span
            ><span><q-icon name="emoji_events" /> Skill Badges</span>
          </div>
        </div>
        <img :src="galleryImage" alt="ผลงานนักเรียน Bot Builder" class="gallery__image" />
      </section>

      <section class="quiz section">
        <q-icon name="quiz" class="quiz__icon" />
        <h2>ทดสอบความรู้หุ่นยนต์!</h2>
        <p>ลองทำแบบทดสอบสนุก ๆ เพื่อดูว่าคุณรู้จัก LEGO Spike Prime ดีแค่ไหน</p>
        <AppButton>TAKE THE QUIZ →</AppButton>
      </section>

      <section class="section enrollment">
        <SectionHeading title="ขั้นตอนการสมัครเรียน" />
        <div class="enrollment__steps">
          <article v-for="(step, index) in steps" :key="step.title">
            <span>{{ index + 1 }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </article>
        </div>
      </section>

      <section class="section branches">
        <SectionHeading title="สาขาของเรา" />
        <div class="branches__map"><img :src="mapImage" alt="แผนที่สาขา Bot Builder" /></div>
        <div class="branches__list">
          <article v-for="branch in branches" :key="branch.name">
            <q-icon name="location_on" />
            <div>
              <strong>{{ branch.name }}</strong
              ><span>{{ branch.address }}</span>
            </div>
          </article>
        </div>
      </section>

      <section class="cta" id="contact">
        <div class="cta__dots" />
        <h2>พร้อมเริ่มก้าวแรกไปกับเราหรือยัง?</h2>
        <p>
          ลงทะเบียนวันนี้เพื่อรับสิทธิ์เข้าทดลองเรียนฟรี 1 ครั้ง
          พร้อมคำแนะนำจากผู้เชี่ยวชาญเพื่อเลือกคอร์สที่เหมาะสมที่สุดสำหรับบุตรหลานของคุณ
        </p>
        <AppButton variant="green">REGISTER NOW</AppButton>
      </section>
    </main>

    <SiteFooter />
  </q-page>
</template>

<script setup lang="ts">
import AppButton from '@/components/landing/AppButton.vue';
import CourseCard from '@/components/landing/CourseCard.vue';
import SectionHeading from '@/components/landing/SectionHeading.vue';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import heroImage from '@/assets/landing/hero.jpeg';
import starterImage from '@/assets/landing/course-starter.jpeg';
import explorerImage from '@/assets/landing/course-explorer.png';
import masterImage from '@/assets/landing/course-master.jpeg';
import galleryImage from '@/assets/landing/gallery.jpeg';
import mapImage from '@/assets/landing/map.jpeg';

const benefits = [
  {
    icon: 'pan_tool',
    title: 'HANDS-ON LEARNING',
    text: 'เน้นการลงมือทำจริงมากกว่าแค่ทฤษฎี เด็ก ๆ จะได้สร้างหุ่นยนต์และโปรแกรมด้วยตัวเองตั้งแต่ชั่วโมงแรก',
  },
  {
    icon: 'school',
    title: 'CERTIFIED MENTORS',
    text: 'สอนโดยผู้เชี่ยวชาญด้านหุ่นยนต์และการศึกษา STEM ที่ได้รับการรับรอง มีประสบการณ์ตรงกับเด็ก',
  },
  {
    icon: 'rocket_launch',
    title: 'FUTURE SKILLS',
    text: 'เตรียมความพร้อมสู่ศตวรรษที่ 21 ด้วยทักษะการคิดเชิงวิพากษ์ และการแก้ไขปัญหาที่ซับซ้อน',
  },
];
const courses = [
  {
    image: starterImage,
    title: 'Starter Coders',
    age: 'Ages 7-9',
    lessons: 12,
    description: 'ปูพื้นฐานการประกอบหุ่นยนต์เบื้องต้นและการใช้ Block-based coding แบบง่าย',
  },
  {
    image: explorerImage,
    title: 'Explorer Bots',
    age: 'Ages 10-12',
    lessons: 24,
    description: 'เรียนรู้การใช้งานเซนเซอร์ การเขียนโปรแกรม และการออกแบบหุ่นยนต์อย่างสร้างสรรค์',
  },
  {
    image: masterImage,
    title: 'Master Engineers',
    age: 'Ages 13-17',
    lessons: 36,
    description: 'ยกระดับไอเดียด้วยการสร้างหุ่นยนต์อัตโนมัติและแก้โจทย์ท้าทายจากโลกจริง',
  },
];
const steps = [
  { title: 'Choose Course', text: 'เลือกคอร์สที่เหมาะกับช่วงวัยและความสนใจ' },
  { title: 'Register', text: 'ลงทะเบียนและเลือกวันเวลาที่สะดวก' },
  { title: 'Start Coding', text: 'เริ่มสนุกกับการสร้างสรรค์หุ่นยนต์ได้เลย' },
];
const branches = [
  { name: 'สาขากรุงเทพฯ', address: 'ห้างสรรพสินค้าชั้นนำ สยามพารากอน' },
  { name: 'สาขาเชียงใหม่', address: 'โครงการ One Nimman' },
  { name: 'สาขาขอนแก่น', address: 'เซ็นทรัลพลาซา ขอนแก่น' },
];
</script>
