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

        <div class="promotion-grid">
          <article v-for="promotion in promotions" :key="promotion.title" class="promotion-card">
            <img :src="promotion.image" :alt="promotion.title" />
            <div class="promotion-card__content">
              <span>{{ promotion.label }}</span>
              <h3>{{ promotion.title }}</h3>
              <p>{{ promotion.description }}</p>
              <ul v-if="promotion.details" class="promotion-card__details">
                <li v-for="detail in promotion.details" :key="detail">{{ detail }}</li>
              </ul>
              <p v-if="promotion.price" class="promotion-card__price">{{ promotion.price }}</p>
              <p v-if="promotion.note" class="promotion-card__note">{{ promotion.note }}</p>
              <a :href="promotion.contactUrl" class="promotion-card__contact">
                สอบถามรายละเอียด
                <q-icon name="arrow_forward" />
              </a>
            </div>
          </article>
        </div>
      </section>

      <section class="promotion-cta">
        <div>
          <p>พร้อมเริ่มต้นการเรียนรู้กับเรา?</p>
          <h2>สอบถามโปรโมชั่นและรอบเรียนได้เลย</h2>
        </div>
        <a href="tel:0824595665" class="promotion-cta__button">
          <q-icon name="phone" />
          082-459-5665
        </a>
      </section>
    </main>

    <SiteFooter />
  </q-page>
</template>

<script setup lang="ts">
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import happyPlayTimeImage from '@/assets/landing/happyplaytime.png';
import promotionImage from '@/assets/landing/promotions.png';
import takeawayMicrobitImage from '@/assets/landing/takeaway.png';
import takeawayPythonImage from '@/assets/landing/takegreen.png';

const phone = '082-459-5665';
const contactUrl = `tel:${phone.replace(/-/g, '')}`;

const promotions = [
  {
    image: promotionImage,
    label: 'PROMOTION',
    title: 'โปรโมชั่นส่วนลดคอร์สเรียน',
    description: 'สมัครเรียนยิ่งมาก ยิ่งคุ้ม',
    details: ['1 คอร์ส ลด 5%', '2 คอร์ส ลด 10%', '3 คอร์ส ลด 15%'],
    note: 'Like Page: BotBuilderThailand เพื่อรับสิทธิ์',
    contactUrl,
  },
  {
    image: takeawayMicrobitImage,
    label: 'NEW COURSE',
    title: 'Robot Takeaway Course with Microbit',
    description: 'หลักสูตรระยะสั้น 4 ชั่วโมง (รอบ 8.00-12.00 น. หรือ 13.00-18.00 น.)',
    details: [
      'เด็กอายุ 6 ปีขึ้นไป ที่สนใจการสร้างหุ่นยนต์',
      'ต้องการเรียนการเขียนโปรแกรมควบคุมหุ่นยนต์เบื้องต้น',
      'ได้หุ่นยนต์เอาไปต่อยอดเล่นที่บ้านได้ (หุ่นมูลค่า 2,500.-)',
    ],
    price: 'ค่าใช้จ่าย: 3,990.-/คน',
    contactUrl,
  },
  {
    image: takeawayPythonImage,
    label: 'NEW COURSE',
    title: 'Robot Takeaway Course with Python',
    description: 'หลักสูตรระยะสั้น 4 ชั่วโมง (รอบ 8.00-12.00 น. หรือ 13.00-18.00 น.)',
    details: [
      'เด็กอายุ 10 ปีขึ้นไป ที่สนใจการสร้างหุ่นยนต์',
      'ต้องการเรียนการเขียนโปรแกรมควบคุมหุ่นยนต์เบื้องต้น',
      'ได้หุ่นยนต์เอาไปต่อยอดเล่นที่บ้านได้ (หุ่นมูลค่า 2,500.-)',
    ],
    price: 'ค่าใช้จ่าย: 3,990.-/คน',
    contactUrl,
  },
  {
    image: happyPlayTimeImage,
    label: 'SPECIAL OFFER',
    title: 'Happy Play Time Promotion',
    description: '4 ครั้งต่อ 1 เดือน ราคาพิเศษ 1,650.-',
    details: ['ราคาปกติ 2,000 บาท / 4 ครั้งภายใน 1 เดือน', 'เรียนครั้งละ 1.5 ชั่วโมง', 'เฉพาะนักเรียนปัจจุบัน'],
    note: 'กรุณาจองล่วงหน้า',
    contactUrl,
  },
];
</script>

<style scoped lang="scss">
.promotions-hero {
  background: linear-gradient(135deg, #f8f9fa 0%, #e4f1e5 100%);
  padding: 80px 5% 72px;
  text-align: center;

  &__eyebrow {
    color: var(--red);
    font: 700 14px Montserrat, sans-serif;
    letter-spacing: 1.5px;
    margin: 0 0 12px;
  }

  h1 {
    color: var(--green);
    font-size: clamp(36px, 5vw, 48px);
    line-height: 1.25;
    margin: 0;
  }

  &__line {
    background: var(--red);
    border-radius: 99px;
    display: block;
    height: 6px;
    margin: 20px auto;
    width: 96px;
  }

  > p:last-child {
    font-size: 18px;
    margin: 0;
  }
}

.promotion-list {
  margin: auto;
  max-width: 1260px;
  padding: 80px 5%;

  > h2 {
    color: var(--green);
    font-size: 28px;
    margin: 0 0 36px;
    text-align: center;
  }
}

.promotion-grid {
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.promotion-card {
  background: #fff;
  border: 1px solid #e1e3e4;
  border-radius: 18px;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.12);
  overflow: hidden;
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    box-shadow: 0 10px 20px rgba(0, 70, 12, 0.14);
    transform: translateY(-5px);
  }

  img {
    background: #eef3ef;
    display: block;
    height: 360px;
    object-fit: contain;
    width: 100%;
  }

  &__content {
    padding: 24px 26px 28px;

    > span {
      color: var(--red);
      font: 700 12px Montserrat, sans-serif;
      letter-spacing: 1px;
    }

    h3 {
      color: var(--green);
      font-size: 22px;
      line-height: 1.35;
      margin: 8px 0;
    }

    p {
      line-height: 1.65;
      margin: 0 0 12px;
    }
  }

  &__details {
    line-height: 1.55;
    margin: 0 0 14px;
    padding-left: 20px;

    li + li {
      margin-top: 4px;
    }
  }

  &__price {
    color: var(--red);
    font-size: 18px;
    font-weight: 700;
  }

  &__note {
    color: #677063;
    font-size: 14px;
    font-weight: 600;
    font-style: italic;
    margin-bottom: 18px !important;
  }

  &__contact {
    align-items: center;
    color: var(--green);
    display: inline-flex;
    font-weight: 700;
    gap: 6px;
    text-decoration: none;

    &:hover {
      color: var(--red);

      .q-icon {
        transform: translateX(3px);
      }
    }

    .q-icon {
      transition: transform 160ms ease;
    }
  }
}

.promotion-cta {
  align-items: center;
  background: var(--green);
  color: #fff;
  display: flex;
  gap: 32px;
  justify-content: space-between;
  padding: 44px max(5%, calc((100% - 1160px) / 2));

  p {
    margin: 0 0 4px;
  }

  h2 {
    font-size: 26px;
    margin: 0;
  }

  &__button {
    align-items: center;
    background: #fff;
    border-radius: 8px;
    color: var(--green);
    display: inline-flex;
    flex: none;
    font-weight: 800;
    gap: 8px;
    padding: 15px 22px;
    text-decoration: none;
  }
}

@media (max-width: 700px) {
  .promotions-hero {
    padding: 58px 16px;

    > p:last-child {
      font-size: 16px;
    }
  }

  .promotion-list {
    padding: 48px 16px;
  }

  .promotion-grid {
    grid-template-columns: 1fr;
  }

  .promotion-card img {
    height: auto;
    max-height: none;
  }

  .promotion-cta {
    align-items: flex-start;
    flex-direction: column;
    gap: 20px;
    padding: 40px 16px;

    h2 {
      font-size: 23px;
    }
  }
}
</style>
