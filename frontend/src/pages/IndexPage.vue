<template>
  <q-page ref="pageRoot" class="landing-page">
    <SiteHeader />

    <main>
      <section class="hero" id="about">
        <div class="hero__image-frame"><img :src="heroImage" alt="เด็ก ๆ เรียนรู้ผ่าน LEGO" /></div>
        <div class="hero__copy" data-reveal>
          <h1><span>เล่นและเรียนรู้ผ่านการทำจริง</span>ด้วยตัวต่อ LEGO</h1>
          <p>
            BotBuilder ประเทศไทยขอเสนอการเรียนรู้แบบลงมือปฏบัติจริงด้วยการบูรณาการ
            ผสานความรู้ทางวิทยาศาสตร์ คณิตศาสตร์และศิลปศาสตร์
            ผ่านการสร้างหุ่นยนต์และชุดอุปกรณ์ที่ออกแบบมาอย่างเหมาะสมสำหรับเด็กอายุ 3-16 ปี
            เพื่อเสริมทักษะ
          </p>
          <AppButton>BOOK YOUR FREE TRIAL</AppButton>
        </div>
      </section>

      <section class="benefits section section--muted">
        <SectionHeading title="ทำไมต้องเรียนกับเรา?" />
        <div class="benefits__grid">
          <article
            v-for="(benefit, index) in benefits"
            :key="benefit.title"
            class="benefit-card"
            data-reveal
            :style="revealDelay(index)"
          >
            <q-icon :name="benefit.icon" />
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.text }}</p>
          </article>
        </div>
      </section>

      <section class="section" id="courses">
        <SectionHeading title="หลักสูตรของเรา" />
        <div class="courses-grid">
          <CourseCard
            v-for="(course, index) in courses"
            :key="course.title"
            v-bind="course"
            data-reveal
            :style="revealDelay(index)"
          />
        </div>
      </section>

      <section class="gallery section section--muted" id="gallery">
        <div class="gallery__copy" data-reveal>
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

      <section class="quiz section" data-reveal>
        <q-icon name="quiz" class="quiz__icon" />
        <h2>ทดสอบความรู้หุ่นยนต์!</h2>
        <p>ลองทำแบบทดสอบสนุก ๆ เพื่อดูว่าคุณรู้จัก LEGO Spike Prime ดีแค่ไหน</p>
        <AppButton>TAKE THE QUIZ →</AppButton>
      </section>

      <section class="section enrollment">
        <SectionHeading title="ขั้นตอนการสมัครเรียน" />
        <div class="enrollment__steps">
          <article
            v-for="(step, index) in steps"
            :key="step.title"
            data-reveal
            :style="revealDelay(index)"
          >
            <span>{{ index + 1 }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </article>
        </div>
      </section>

      <section class="section branches">
        <SectionHeading title="สาขาของเรา" />
        <div class="branches__maps">
          <div
            v-for="(branch, index) in branches"
            :key="`${branch.name}-map`"
            class="branches__map"
            data-reveal
            :style="revealDelay(index)"
          >
            <iframe
              :src="branch.mapEmbedUrl"
              :title="`แผนที่ ${branch.name}`"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen
            />
          </div>
        </div>
        <div class="branches__list">
          <article
            v-for="(branch, index) in branches"
            :key="branch.name"
            data-reveal
            :style="revealDelay(index)"
          >
            <q-icon name="location_on" />
            <div class="branch-card__content">
              <strong>{{ branch.name }}</strong>
              <span class="branch-card__address">{{ branch.address }}</span>
              <p>{{ branch.description }}</p>
              <dl class="branch-card__hours">
                <div v-for="hour in branch.hours" :key="hour.days">
                  <dt>{{ hour.days }}</dt>
                  <dd>{{ hour.time }}</dd>
                </div>
              </dl>
              <a :href="`tel:${branch.phone.replace(/-/g, '')}`" class="branch-card__phone">
                <q-icon name="phone" />
                <span>ติดต่อด่วน {{ branch.phone }} ({{ branch.contactName }})</span>
              </a>
            </div>
          </article>
        </div>
      </section>

      <section class="cta" id="contact" data-reveal>
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
import { onBeforeUnmount, onMounted, ref } from 'vue';
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

const pageRoot = ref<HTMLElement | null>(null);
let revealObserver: IntersectionObserver | undefined;

const revealDelay = (index: number) => ({ '--reveal-delay': `${index * 90}ms` });

onMounted(() => {
  const revealElements = pageRoot.value?.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!revealElements?.length) return;

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-revealed');
        revealObserver?.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );

  revealElements.forEach((element) => revealObserver?.observe(element));
});

onBeforeUnmount(() => revealObserver?.disconnect());

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
  {
    name: 'สาขาบางแสน',
    address: 'บางแสน จังหวัดชลบุรี',
    description:
      'สาขาหลักของ BotBuilder Thailand อยู่ติดกับโรงเรียนสาธิตพิบูลบำเพ็ญ มหาวิทยาลัยบูรพา ใกล้กับแหล่งท่องเที่ยวและร้านอาหารดัง ๆ มากมาย',
    hours: [
      { days: 'อังคาร - ศุกร์', time: '14.30 - 19.00 น.' },
      { days: 'เสาร์ - อาทิตย์', time: '8.00 - 18.00 น.' },
    ],
    phone: '082-459-5665',
    contactName: 'อุ๋ม',
    // วาง URL จาก Google Maps > Share > Embed a map > Copy HTML (เฉพาะค่าใน src="...") ที่นี่
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d3884.930516016332!2d100.934786!3d13.166781!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDEwJzAwLjUiTiAxMDDCsDU2JzA1LjMiRQ!5e0!3m2!1sth!2sus!4v1785420473849!5m2!1sth!2sus',
  },
  {
    name: 'สาขาศรีราชา',
    address: 'ห้างอิออนศรีราชา ชั้น 3 (หน้าลิฟท์)',
    description: 'สาขาที่ 2 ของ BotBuilder ประจำอำเภอศรีราชา ด้านข้างโรงเรียนอัสสัมชัญศรีราชา',
    hours: [
      { days: 'อังคาร - ศุกร์', time: '14.30 - 19.00 น.' },
      { days: 'เสาร์ - อาทิตย์', time: '8.00 - 18.00 น.' },
    ],
    phone: '095-362-5366',
    contactName: 'กัน',
    // วาง URL จาก Google Maps > Share > Embed a map > Copy HTML (เฉพาะค่าใน src="...") ที่นี่
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d3875.79482217073!2d100.9325961085095!3d13.167610042568008!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDEwJzAwLjUiTiAxMDDCsDU2JzA1LjMiRQ!5e0!3m2!1sth!2sus!4v1785420269794!5m2!1sth!2sus',
  },
];
</script>
