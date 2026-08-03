<template>
  <q-page class="landing-page">
    <SiteHeader />

    <main ref="pageRoot">
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
        <SectionHeading title="รูปแบบกิจกรรม" />
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

      <section class="section activity-gallery" id="activity-gallery" data-reveal>
        <SectionHeading title="รวมภาพกิจกรรมใน BotBuilder" />
        <q-carousel
          v-model="activitySlide"
          class="activity-gallery__carousel"
          height="380px"
          arrows
          navigation
          swipeable
          animated
          infinite
          control-color="white"
        >
          <q-carousel-slide
            v-for="(photo, index) in activityPhotos"
            :key="photo.src"
            :name="index"
            class="activity-gallery__slide"
          >
            <img
              :src="photo.src"
              :alt="photo.alt"
              class="activity-gallery__image"
              @click="openLightbox(index)"
            />
          </q-carousel-slide>
        </q-carousel>
      </section>

      <section class="quiz section" data-reveal>
        <q-icon name="quiz" class="quiz__icon" />
        <h2>ทดสอบความรู้หุ่นยนต์!</h2>
        <p>ลองทำแบบทดสอบสนุก ๆ เพื่อดูว่าคุณรู้จัก LEGO Spike Prime ดีแค่ไหน</p>
        <AppButton @click="quizOpen = true">TAKE THE QUIZ →</AppButton>
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

    <QuizPanel v-model="quizOpen" />

    <q-dialog v-model="lightboxOpen" transition-show="scale" transition-hide="scale">
      <div class="lightbox">
        <q-btn
          flat
          round
          dense
          icon="close"
          class="lightbox__close"
          aria-label="ปิด"
          @click="lightboxOpen = false"
        />
        <q-carousel
          v-model="lightboxSlide"
          class="lightbox__carousel"
          height="80vh"
          arrows
          navigation
          swipeable
          animated
          infinite
          control-color="white"
        >
          <q-carousel-slide
            v-for="(photo, index) in activityPhotos"
            :key="photo.src"
            :name="index"
            class="lightbox__slide"
          >
            <img :src="photo.src" :alt="photo.alt" class="lightbox__image" />
          </q-carousel-slide>
        </q-carousel>
      </div>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import AppButton from '@/components/landing/AppButton.vue';
import CourseCard from '@/components/landing/CourseCard.vue';
import QuizPanel from '@/components/landing/QuizPanel.vue';
import SectionHeading from '@/components/landing/SectionHeading.vue';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import heroImage from '@/assets/landing/hero.jpeg';
import starterImage from '@/assets/landing/gallery.jpeg';
import explorerImage from '@/assets/landing/playlearn.png';
import masterImage from '@/assets/landing/roboticcamp.png';
import galleryImage from '@/assets/landing/gallery.jpeg';
import promotionsPhoto from '@/assets/landing/promotions.png';
import happyPlayTimePhoto from '@/assets/landing/happyplaytime.png';
import exploringSpacePhoto from '@/assets/landing/exploringspace.png';
import takeawayMicrobitPhoto from '@/assets/landing/takeaway.png';
import takeawayPythonPhoto from '@/assets/landing/takegreen.png';
import precompetePhoto from '@/assets/landing/precompete.png';

const pageRoot = ref<HTMLElement | null>(null);
const quizOpen = ref(false);
const activitySlide = ref(0);
const lightboxOpen = ref(false);
const lightboxSlide = ref(0);
let revealObserver: IntersectionObserver | undefined;

const activityPhotos = [
  { src: promotionsPhoto, alt: 'กิจกรรมโปรโมชั่นของ BotBuilder' },
  { src: happyPlayTimePhoto, alt: 'กิจกรรม Happy Play Time' },
  { src: exploringSpacePhoto, alt: 'ค่ายปิดเทอม: สำรวจอวกาศ' },
  { src: takeawayMicrobitPhoto, alt: 'Robot Takeaway Course with Microbit' },
  { src: takeawayPythonPhoto, alt: 'Robot Takeaway Course with Python' },
  { src: precompetePhoto, alt: 'เตรียมความพร้อมสู่การแข่งขันหุ่นยนต์' },
];

const openLightbox = (index: number) => {
  lightboxSlide.value = index;
  lightboxOpen.value = true;
};

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
    title: 'เล่น เรียน สร้าง',
    lessons: 12,
    description: 'มุ่งเน้นความหลากหลายของแบบหุ่นยนต์ ความคิดสร้างสรรค์ การเขียนโปรแกรมพื้นฐานและการนำเสนอผลงาน โดยมีความสอดคล้องกับอายุ ความสนใจและความสามารถของน้องแบ่งออกเป็น 3 ระดับ Beginner Intermediate และ Advance',
  },
  {
    image: explorerImage,
    title: 'ค่ายหุ่นยนต์',
    lessons: 24,
    description: 'มุ่งเน้นกิจกรรมภารกิจ การวางแผนและการทำงานเป็นทีม ภารกิจจะเป็นเครื่องกำหนดรูปแบบของหุ่นยนต์ทำให้น้องๆ ต้องมีการออกแบบและสร้างขึ้นใหม่ ตามรูปแบบกิจกรรมในแต่ละครั้ง และสามารถจัดแบบนอกสนานที่เพื่อสร้างความแปลกใหม่',
  },
  {
    image: masterImage,
    title: 'เตรียมการแข่งขัน',
    lessons: 36,
    description: 'มุ่งเน้นการออกแบบ สร้างและการหุ่นยนต์เพื่อการแข่งขันโดยเฉพาะ เน้นการคิดเพื่อแก้ไขปัญหาและการซ้อมเพื่อสร้างโอกาสชนะในการแข่งขัน โดยมีรายการแข่งขัน เช่น Lego FLL, World Robot Olympiad™ , Robot Battel และอื่นๆ',
  },
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
