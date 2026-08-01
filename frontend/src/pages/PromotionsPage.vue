<template>
  <q-page class="landing-page promotions-page">
    <SiteHeader />

    <main>
      <section class="promotions-hero">
        <p class="promotions-hero__eyebrow">PROMOTIONS</p>
        <h1>โปรโมชั่น</h1>
        <span class="promotions-hero__line" />
        <p>สิทธิพิเศษและคอร์สเรียนสนุก ๆ จาก Bot Builder</p>
      </section>

      <section class="promotion-list" aria-labelledby="promotion-list-title">
        <h2 id="promotion-list-title">โปรโมชั่นและกิจกรรม</h2>
      </section>

      <section v-for="promotion in promotions" :key="promotion.title" class="promotion-course">
        <div class="promotion-course__inner">
          <div class="promotion-course__image">
            <img :src="promotion.image" :alt="promotion.title" />
          </div>
          <div class="promotion-course__content">
            <span>{{ promotion.label }}</span>
            <h3>{{ promotion.title }}</h3>
            <p v-for="(line, i) in promotion.description" :key="i">{{ line }}</p>
            <ul v-if="promotion.details" class="promotion-course__details">
              <li v-for="detail in promotion.details" :key="detail">{{ detail }}</li>
            </ul>
            <p v-if="promotion.likeUrl" class="promotion-course__like">
              {{ promotion.likeText }}
              <a :href="promotion.likeUrl" target="_blank" rel="noopener">{{ promotion.likeLabel }}</a>
            </p>
            <p v-if="promotion.price" class="promotion-course__price">{{ promotion.price }}</p>
            <p v-if="promotion.note" class="promotion-course__note">{{ promotion.note }}</p>
          </div>
        </div>
      </section>

      <section class="promotion-cta">
        <div>
          <p>พร้อมเริ่มต้นการเรียนรู้กับเรา?</p>
          <h2>สอบถามโปรโมชั่นและรอบเรียนได้เลย</h2>
        </div>
        <a href="https://www.facebook.com/BotBuilderThailand/" target="_blank" class="promotion-cta__button">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path
              d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z"
            />
          </svg>
          BotBuilderThailand
        </a>
      </section>
    </main>

    <SiteFooter />
  </q-page>
</template>

<script setup lang="ts">
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import promotionImage from '@/assets/landing/promotions.png';
import happyPlayTimeImage from '@/assets/landing/happyplaytime.png';
import exploringSpaceImage from '@/assets/landing/exploringspace.png';
import takeawayMicrobitImage from '@/assets/landing/takeaway.png';
import takeawayPythonImage from '@/assets/landing/takegreen.png';

const promotions = [
  {
    image: promotionImage,
    label: 'PROMOTION',
    title: 'Promotions สำหรับสมาชิกใหม่และนักสร้างมือเก๋า',
    description: ['ลดทันทีเมื่อเริ่มหรือต่อคอร์ส'],
    details: ['1 คอร์ส ลด 5%', '2 คอร์ส ลด 10%', '3 คอร์ส ลด 15%'],
    note: 'เงื่อนไข: ขอสงวนการลดเป็นความต่อเนื่องของน้องแต่ละคน',
    likeText: 'เมื่อกด Like เพจ',
    likeUrl: 'https://www.facebook.com/BotBuilderThailand/',
    likeLabel: 'BotBuilderThailand',
  },
  {
    image: happyPlayTimeImage,
    label: 'SPECIAL OFFER',
    title: 'Happy Play Time Promotion',
    description: [
      'BotBuilder ขอชวนน้อง ๆ มาสนุกกับหุ่นยนต์แบบอิสระ ผ่านแบบหุ่นยนต์มากมายกว่า 100 แบบ ด้วย Package สุดคุ้มเพียง 1,650 บาท เข้ามาสร้างหุ่นยนต์อิสระได้ 4 ครั้ง',
    ],
    price: '1,650.- / 4 ครั้ง',
    note: 'เหมาะสำหรับนักเรียนที่เคยเรียนมาแล้วเท่านั้น!',
  },
  {
    image: exploringSpaceImage,
    label: 'HOLIDAY CAMP',
    title: 'ค่ายปิดเทอม: สำรวจอวกาศ',
    description: [
      'BotBuilder ขอชวนน้อง ๆ มาเข้าค่ายหุ่นยนต์ในเรื่องราวของการสำรวจอวกาศ',
      'น้อง ๆ จะได้ออกแบบ สร้าง และเขียนโปรแกรมควบคุมหุ่นยนต์สำหรับภารกิจในห้วงลึกของจักรวาล ค่ายจัด 4 วันเต็ม สำหรับน้อง ๆ วัย 4-10 ขวบ รวมค่าอาหารกลางวันและเบรกประจำวันแล้ว',
    ],
    details: [
      'ฐานปฏิบัติการส่งจรวด',
      'ยานสำรวจอวกาศ',
      'สถานีอวกาศ',
      'ยานสำรวจดวงจันทร์',
      'ยานนำร่อง',
      'หุ่นยนต์ปฏิบัติการค้นหาและสำรวจ',
      'Pathfinder',
      'พร้อมภารกิจแบบช่วยเหลือกันเพื่อกลับสู่โลก',
    ],
    price: '6,900.- (ปกติ 9,900.-)',
  },
  {
    image: takeawayMicrobitImage,
    label: 'NEW COURSE',
    title: 'Robot Takeaway Course with Microbit',
    description: [
      'หลักสูตรระยะสั้น 4 ชั่วโมง (รอบ 8.00-12.00 น. หรือ 13.00-18.00 น.)',
      'น้องจะได้รับประสบการณ์สร้างหุ่นยนต์จากเริ่มต้น ผ่านตัวควบคุม Microbit พร้อมสั่งการด้วยภาษารูปภาพ หุ่นยนต์และโปรแกรมสามารถนำกลับไปเล่นและต่อยอดด้วยตนเองที่บ้านได้ หุ่นจะสามารถสั่งการผ่านโปรแกรมหรือสั่งการเคลื่อนที่ผ่านมือถือได้',
    ],
    details: [
      'เด็กอายุ 6 ปีขึ้นไป ที่สนใจการสร้างหุ่นยนต์',
      'ต้องการเรียนการเขียนโปรแกรมควบคุมหุ่นยนต์เบื้องต้น',
      'ได้หุ่นยนต์เอาไปต่อยอดเล่นที่บ้านได้ (หุ่นมูลค่า 2,500.-)',
    ],
    price: 'ค่าใช้จ่าย: 3,990.-/คน',
  },
  {
    image: takeawayPythonImage,
    label: 'NEW COURSE',
    title: 'Robot Takeaway Course with Python',
    description: [
      'หลักสูตรระยะสั้น 4 ชั่วโมง (รอบ 8.00-12.00 น. หรือ 13.00-18.00 น.)',
      'น้องจะได้รับประสบการณ์สร้างหุ่นยนต์จากเริ่มต้น ผ่านตัวควบคุม Microbit พร้อมสั่งการด้วยภาษา Python หุ่นยนต์และโปรแกรมสามารถนำกลับไปเล่นและต่อยอดด้วยตนเองที่บ้านได้ หุ่นจะสามารถสั่งการผ่านโปรแกรม Mycode ได้',
    ],
    details: [
      'เด็กอายุ 10 ปีขึ้นไป ที่สนใจการสร้างหุ่นยนต์',
      'ต้องการเรียนการเขียนโปรแกรมควบคุมหุ่นยนต์เบื้องต้น',
      'ได้หุ่นยนต์เอาไปต่อยอดเล่นที่บ้านได้ (หุ่นมูลค่า 2,500.-)',
    ],
    price: 'ค่าใช้จ่าย: 3,990.-/คน',
  },
];
</script>

<style scoped lang="scss">
@use '@/css/pages/promotions';
</style>