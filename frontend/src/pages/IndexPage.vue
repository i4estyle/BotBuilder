<template>
  <q-page class="landing-page">
    <SiteHeader />

    <main ref="pageRoot">
      <section class="hero" id="about">
        <div class="hero__image-frame">
          <div class="hero__image-inner">
            <img :src="heroImage" :alt="t('home.hero.imageAlt')" />
          </div>
        </div>
        <div class="hero__copy" data-reveal>
          <h1>
            <span>{{ t('home.hero.titleHighlight') }}</span
            >{{ t('home.hero.titleRest') }}
          </h1>
          <p>{{ t('home.hero.paragraph') }}</p>
          <ul class="hero__skills">
            <li v-for="skill in i18n.tm('home.hero.skills') as string[]" :key="skill">
              {{ skill }}
            </li>
          </ul>
          <p class="hero__booking-note">
            {{ t('home.hero.bookingNote') }}
            <a
              href="https://line.me/R/ti/p/@botbuilderthailand"
              target="_blank"
              rel="noopener noreferrer"
              >@botbuilderthailand</a
            >
          </p>
          <div class="hero__actions">
            <AppButton
              href="https://line.me/R/ti/p/@botbuilderthailand"
              class="app-button--stacked"
            >
              {{ t('home.hero.ctaLabel') }}<span>{{ t('home.hero.ctaBangsaen') }}</span>
            </AppButton>
            <AppButton
              variant="outline"
              href="https://line.me/R/ti/p/@botbuilderthailand"
              class="app-button--stacked"
            >
              {{ t('home.hero.ctaLabel') }}<span>{{ t('home.hero.ctaSriracha') }}</span>
            </AppButton>
          </div>
        </div>
      </section>

      <section class="benefits section section--muted">
        <SectionHeading :title="t('home.benefits.heading')" />
        <div class="benefits__grid">
          <article
            v-for="(benefit, index) in benefits"
            :key="index"
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

      <section class="section" id="activity-formats">
        <SectionHeading :title="t('home.activityFormats.heading')" />
        <ActivityFormats :items="activityFormats" />
      </section>

      <section class="gallery section section--muted" id="gallery">
        <div class="gallery__copy" data-reveal>
          <SectionHeading :title="t('home.gallery.heading')" :centered="false" />
          <p>{{ t('home.gallery.paragraph') }}</p>
          <div class="gallery__stats">
            <span><q-icon name="verified" /> {{ t('home.gallery.courseCertified') }}</span
            ><span><q-icon name="emoji_events" /> {{ t('home.gallery.skillBadges') }}</span>
          </div>
        </div>
        <img :src="certificate" :alt="t('home.gallery.imageAlt')" class="gallery__image" />
      </section>

      <section class="section activity-gallery" id="activity-gallery" data-reveal>
        <SectionHeading :title="t('home.activityGallery.heading')" />
        <div class="activity-gallery__columns">
          <div
            v-for="(group, groupIndex) in activityGroups"
            :key="groupIndex"
            class="activity-gallery__column"
          >
            <h3 class="activity-gallery__column-title">{{ group.title }}</h3>
            <q-carousel
              v-model="group.slide.value"
              class="activity-gallery__carousel"
              height="320px"
              arrows
              navigation
              swipeable
              animated
              infinite
              control-color="white"
            >
              <q-carousel-slide
                v-for="(photo, index) in group.photos"
                :key="photo.src"
                :name="index"
                class="activity-gallery__slide"
              >
                <img
                  :src="photo.src"
                  :alt="photo.alt"
                  class="activity-gallery__image"
                  @click="openLightbox(group.photos, index)"
                />
              </q-carousel-slide>
            </q-carousel>
          </div>
        </div>
      </section>

      <section class="quiz section" data-reveal>
        <q-icon name="quiz" class="quiz__icon" />
        <h2>{{ t('home.quizTeaser.heading') }}</h2>
        <p>{{ t('home.quizTeaser.paragraph') }}</p>
        <AppButton @click="quizOpen = true">{{ t('home.quizTeaser.cta') }}</AppButton>
      </section>

      <section class="section branches">
        <SectionHeading :title="t('home.branches.heading')" />
        <div class="branches__grid">
          <div
            v-for="(branch, index) in branches"
            :key="index"
            class="branch-block"
            data-reveal
            :style="revealDelay(index)"
          >
            <div class="branches__map">
              <iframe
                :src="branch.mapEmbedUrl"
                :title="t('home.branches.mapTitle', { name: branch.name })"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                allowfullscreen
              />
            </div>
            <article class="branch-card">
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
                  <span>{{
                    t('home.branches.contactLine', {
                      phone: branch.phone,
                      contactName: branch.contactName,
                    })
                  }}</span>
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="cta" id="contact" data-reveal>
        <div class="cta__dots" />
        <h2>{{ t('home.cta.heading') }}</h2>
        <p>{{ t('home.cta.paragraph') }}</p>
        <AppButton variant="green">{{ t('home.cta.button') }}</AppButton>
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
          :aria-label="t('home.lightbox.close')"
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
            v-for="(photo, index) in lightboxPhotos"
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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ActivityFormats from '@/components/landing/ActivityFormats.vue';
import AppButton from '@/components/landing/AppButton.vue';
import QuizPanel from '@/components/landing/QuizPanel.vue';
import SectionHeading from '@/components/landing/SectionHeading.vue';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import heroImage from '@/assets/landing/intro.png';
import starterImage from '@/assets/landing/playlearn.png';
import explorerImage from '@/assets/landing/roboticcamp.png';
import masterImage from '@/assets/landing/precompete.png';
import certificate from '@/assets/landing/cretificate.jpg';
import promotionsPhoto from '@/assets/landing/promotions.png';
import happyPlayTimePhoto from '@/assets/landing/happyplaytime.png';
import exploringSpacePhoto from '@/assets/landing/exploringspace.png';
import takeawayMicrobitPhoto from '@/assets/landing/takeaway.png';
import takeawayPythonPhoto from '@/assets/landing/takegreen.png';
import precompetePhoto from '@/assets/landing/precompete.png';

const i18n = useI18n();
const { t } = i18n;

const pageRoot = ref<HTMLElement | null>(null);
const quizOpen = ref(false);
const lightboxOpen = ref(false);
const lightboxSlide = ref(0);
let revealObserver: IntersectionObserver | undefined;

type ActivityPhoto = { src: string; alt: string };

// TODO: ตรวจสอบการจัดหมวดหมู่รูปด้านล่าง — จัดตามชื่อ/บริบทเบื้องต้น รอผู้ใช้ยืนยัน
const internalActivityImages = [promotionsPhoto, happyPlayTimePhoto, precompetePhoto];
const offsiteActivityImages = [exploringSpacePhoto, takeawayMicrobitPhoto, takeawayPythonPhoto];
const groupImages = [internalActivityImages, offsiteActivityImages];
const groupSlides = [ref(0), ref(0)];

const activityGroups = computed(() => {
  const groups = i18n.tm('home.activityGallery.groups');
  return groups.map((group, groupIndex) => ({
    title: group.title,
    slide: groupSlides[groupIndex]!,
    photos: group.photos.map<ActivityPhoto>((photo, photoIndex) => ({
      src: groupImages[groupIndex]![photoIndex]!,
      alt: photo.alt,
    })),
  }));
});

const lightboxPhotos = ref<ActivityPhoto[]>([]);

const openLightbox = (photos: ActivityPhoto[], index: number) => {
  lightboxPhotos.value = photos;
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

const benefitIcons = ['pan_tool', 'school', 'rocket_launch'];
const benefits = computed(() => {
  const items = i18n.tm('home.benefits.items');
  return items.map((item, index) => ({ ...item, icon: benefitIcons[index]! }));
});

const activityFormatImages = [starterImage, explorerImage, masterImage];
const activityFormats = computed(() => {
  const items = i18n.tm('home.activityFormats.items');
  return items.map((item, index) => ({ ...item, image: activityFormatImages[index]! }));
});

const branchMeta = [
  {
    phone: '082-459-5665',
    contactName: 'อุ๋ม',
    // วาง URL จาก Google Maps > Share > Embed a map > Copy HTML (เฉพาะค่าใน src="...") ที่นี่
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d3884.930516016332!2d100.934786!3d13.166781!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDEwJzAwLjUiTiAxMDDCsDU2JzA1LjMiRQ!5e0!3m2!1sth!2sus!4v1785420473849!5m2!1sth!2sus',
  },
  {
    phone: '095-362-5366',
    contactName: 'กัน',
    // วาง URL จาก Google Maps > Share > Embed a map > Copy HTML (เฉพาะค่าใน src="...") ที่นี่
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d3875.79482217073!2d100.9325961085095!3d13.167610042568008!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDEwJzAwLjUiTiAxMDDCsDU2JzA1LjMiRQ!5e0!3m2!1sth!2sus!4v1785420269794!5m2!1sth!2sus',
  },
];
const branches = computed(() => {
  const items = i18n.tm('home.branches.items');
  return items.map((item, index) => ({ ...item, ...branchMeta[index]! }));
});
</script>
