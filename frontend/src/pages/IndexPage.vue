<template>
  <q-page class="landing-page">
    <main ref="pageRoot">
      <template v-for="item in navSections" :key="item.id">
        <!-- Header -->
        <SiteHeader v-if="item.id === 'header'" />

        <!-- Hero -->
        <section v-else-if="item.id === 'hero'" class="hero" id="about">
          <div class="hero__image-frame">
            <div class="hero__image-inner" :style="getStyleOverride('hero.image')">
              <img :src="resolveAssetUrl(heroData.image)" :alt="heroData.imageAlt" />
            </div>
          </div>
          <div class="hero__copy" data-reveal>
            <h1>
              <span :style="getStyleOverride('hero.titleHighlight')">{{
                heroData.titleHighlight
              }}</span
              ><span :style="getStyleOverride('hero.titleRest')">{{ heroData.titleRest }}</span>
            </h1>
            <p :style="getStyleOverride('hero.paragraph')">{{ heroData.paragraph }}</p>
            <ul class="hero__skills">
              <li
                v-for="(skill, index) in heroData.skills"
                :key="index"
                :style="getStyleOverride(`hero.skills.${index}`)"
              >
                {{ skill }}
              </li>
            </ul>
            <p class="hero__booking-note" :style="getStyleOverride('hero.bookingNote')">
              {{ heroData.bookingNote }}
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
                <span :style="getStyleOverride('hero.ctaLabel')">{{ heroData.ctaLabel }}</span
                ><span :style="getStyleOverride('hero.ctaBangsaen')">{{
                  heroData.ctaBangsaen
                }}</span>
              </AppButton>
              <AppButton
                variant="outline"
                href="https://line.me/R/ti/p/@botbuilderthailand"
                class="app-button--stacked"
              >
                <span :style="getStyleOverride('hero.ctaLabel')">{{ heroData.ctaLabel }}</span
                ><span :style="getStyleOverride('hero.ctaSriracha')">{{
                  heroData.ctaSriracha
                }}</span>
              </AppButton>
            </div>
          </div>
          <AdminSectionBlockLayer section-id="hero" />
        </section>

        <!-- Benefits -->
        <section v-else-if="item.id === 'benefits'" class="benefits section section--muted">
          <SectionHeading
            :title="benefitsData.heading"
            :style="getStyleOverride('benefits.heading')"
          />
          <div class="benefits__grid">
            <article
              v-for="(benefit, index) in benefitsData.items"
              :key="index"
              class="benefit-card"
              data-reveal
              :style="revealDelay(index)"
            >
              <q-icon
                :name="benefit.icon || 'star'"
                :style="getStyleOverride(`benefits.items.${index}.icon`)"
              />
              <h3 :style="getStyleOverride(`benefits.items.${index}.title`)">
                {{ benefit.title }}
              </h3>
              <p :style="getStyleOverride(`benefits.items.${index}.text`)">{{ benefit.text }}</p>
            </article>
          </div>
          <AdminSectionBlockLayer section-id="benefits" />
        </section>

        <!-- Activity Formats -->
        <section v-else-if="item.id === 'activityFormats'" class="section" id="activity-formats">
          <SectionHeading
            :title="activityFormatsData.heading"
            :style="getStyleOverride('activityFormats.heading')"
          />
          <ActivityFormats :items="activityFormatsData.items" />
          <AdminSectionBlockLayer section-id="activityFormats" />
        </section>

        <!-- Gallery -->
        <section
          v-else-if="item.id === 'gallery'"
          class="gallery section section--muted"
          id="gallery"
        >
          <div class="gallery__copy" data-reveal>
            <SectionHeading
              :title="galleryData.heading"
              :centered="false"
              :style="getStyleOverride('gallery.heading')"
            />
            <p :style="getStyleOverride('gallery.paragraph')">{{ galleryData.paragraph }}</p>
            <div class="gallery__stats">
              <span :style="getStyleOverride('gallery.courseCertified')"
                ><q-icon name="verified" /> {{ galleryData.courseCertified }}</span
              ><span :style="getStyleOverride('gallery.skillBadges')"
                ><q-icon name="emoji_events" /> {{ galleryData.skillBadges }}</span
              >
            </div>
          </div>
          <img
            :src="resolveAssetUrl(galleryData.certificateImage)"
            :alt="galleryData.imageAlt"
            class="gallery__image"
            :style="getStyleOverride('gallery.certificateImage')"
          />
          <AdminSectionBlockLayer section-id="gallery" />
        </section>

        <!-- Activity Gallery -->
        <section
          v-else-if="item.id === 'activityGallery'"
          class="section activity-gallery"
          id="activity-gallery"
          data-reveal
        >
          <SectionHeading
            :title="activityGalleryData.heading"
            :style="getStyleOverride('activityGallery.heading')"
          />
          <div class="activity-gallery__columns">
            <div
              v-for="(group, groupIndex) in activityGalleryData.groups"
              :key="groupIndex"
              class="activity-gallery__column"
            >
              <h3
                class="activity-gallery__column-title"
                :style="getStyleOverride(`activityGallery.groups.${groupIndex}.title`)"
              >
                {{ group.title }}
              </h3>
              <q-carousel
                v-model="groupSlides[groupIndex]"
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
                  v-for="(photo, photoIndex) in group.photos"
                  :key="photoIndex"
                  :name="photoIndex"
                  class="activity-gallery__slide"
                >
                  <img
                    :src="resolveAssetUrl(photo.src)"
                    :alt="photo.alt"
                    class="activity-gallery__image"
                    @click="openLightbox(group.photos, photoIndex)"
                  />
                </q-carousel-slide>
              </q-carousel>
            </div>
          </div>
          <AdminSectionBlockLayer section-id="activityGallery" />
        </section>

        <!-- Quiz -->
        <section v-else-if="item.id === 'quiz'" class="quiz section" data-reveal>
          <q-icon name="quiz" class="quiz__icon" :style="getStyleOverride('quiz.icon')" />
          <h2 :style="getStyleOverride('quiz.heading')">{{ quizData.heading }}</h2>
          <p :style="getStyleOverride('quiz.paragraph')">{{ quizData.paragraph }}</p>
          <AppButton @click="quizOpen = true">
            <span :style="getStyleOverride('quiz.cta')">{{ quizData.cta }}</span>
          </AppButton>
          <AdminSectionBlockLayer section-id="quiz" />
        </section>

        <!-- Branches -->
        <section v-else-if="item.id === 'branches'" class="section branches">
          <SectionHeading
            :title="branchesData.heading"
            :style="getStyleOverride('branches.heading')"
          />
          <div class="branches__grid">
            <div
              v-for="(branch, index) in branchesData.items"
              :key="index"
              class="branch-block"
              data-reveal
              :style="revealDelay(index)"
            >
              <div class="branches__map">
                <iframe
                  :src="branch.mapEmbedUrl"
                  :title="branch.name"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  allowfullscreen
                />
              </div>
              <article class="branch-card">
                <q-icon name="location_on" />
                <div class="branch-card__content">
                  <strong :style="getStyleOverride(`branches.items.${index}.name`)">{{
                    branch.name
                  }}</strong>
                  <span
                    class="branch-card__address"
                    :style="getStyleOverride(`branches.items.${index}.address`)"
                    >{{ branch.address }}</span
                  >
                  <p :style="getStyleOverride(`branches.items.${index}.description`)">
                    {{ branch.description }}
                  </p>
                  <dl class="branch-card__hours">
                    <div v-for="hour in branch.hours" :key="hour.days">
                      <dt>{{ hour.days }}</dt>
                      <dd>{{ hour.time }}</dd>
                    </div>
                  </dl>
                  <a :href="`tel:${branch.phone.replace(/-/g, '')}`" class="branch-card__phone">
                    <q-icon name="phone" />
                    <span
                      >โทร.
                      <span :style="getStyleOverride(`branches.items.${index}.phone`)">{{
                        branch.phone
                      }}</span>
                      (<span :style="getStyleOverride(`branches.items.${index}.contactName`)"
                        >ครู{{ branch.contactName }}</span
                      >)</span
                    >
                  </a>
                </div>
              </article>
            </div>
          </div>
          <AdminSectionBlockLayer section-id="branches" />
        </section>

        <!-- CTA -->
        <section v-else-if="item.id === 'cta'" class="cta" id="contact" data-reveal>
          <div class="cta__dots" />
          <h2 :style="getStyleOverride('cta.heading')">{{ ctaData.heading }}</h2>
          <p :style="getStyleOverride('cta.paragraph')">{{ ctaData.paragraph }}</p>
          <AppButton variant="green" href="https://line.me/R/ti/p/@botbuilderthailand">
            <span :style="getStyleOverride('cta.button')">{{ ctaData.button }}</span>
          </AppButton>
          <AdminSectionBlockLayer section-id="cta" />
        </section>

        <!-- Footer -->
        <SiteFooter v-else-if="item.id === 'footer'" />

        <!-- Custom Page Block -->
        <section
          v-else-if="item.isCustomPage"
          :id="item.id"
          class="section custom-section"
          data-reveal
        >
          <SectionHeading :title="item.title" />
          <div v-if="getCustomBlock(item.id)?.type === 'text'" class="custom-section__text">
            <p>{{ getCustomBlock(item.id)?.content }}</p>
          </div>
          <div v-else-if="getCustomBlock(item.id)?.type === 'image'" class="custom-section__image">
            <img
              :src="resolveAssetUrl(getCustomBlock(item.id)?.image || '')"
              :alt="item.title"
              style="max-width: 100%; border-radius: 12px"
            />
          </div>
          <AdminSectionBlockLayer :section-id="item.id" />
        </section>
      </template>
    </main>

    <QuizPanel v-model="quizOpen" />

    <q-dialog v-model="lightboxOpen" transition-show="scale" transition-hide="scale">
      <div class="lightbox">
        <q-btn
          flat
          round
          dense
          icon="close"
          class="lightbox__close"
          aria-label="Close lightbox"
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
            :key="index"
            :name="index"
            class="lightbox__slide"
          >
            <img :src="resolveAssetUrl(photo.src)" :alt="photo.alt" class="lightbox__image" />
          </q-carousel-slide>
        </q-carousel>
      </div>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, reactive, watch } from 'vue';
import ActivityFormats from '@/components/landing/ActivityFormats.vue';
import AppButton from '@/components/landing/AppButton.vue';
import QuizPanel from '@/components/landing/QuizPanel.vue';
import SectionHeading from '@/components/landing/SectionHeading.vue';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { resolveAssetUrl } from '@/utils/asset-helper';
import type { ActivityPhotoItem } from '@/composables/website-editor/types';

const {
  hero: heroData,
  benefits: benefitsData,
  activityFormats: activityFormatsData,
  gallery: galleryData,
  activityGallery: activityGalleryData,
  quiz: quizData,
  branches: branchesData,
  cta: ctaData,
  customBlocks,
  navSections,
  editorLocale,
  fetchPageData,
  getStyleOverride,
} = useWebsiteEditor();

function getCustomBlock(id: string) {
  return customBlocks.find((b) => b.id === id);
}

const pageRoot = ref<HTMLElement | null>(null);
const quizOpen = ref(false);
const lightboxOpen = ref(false);
const lightboxSlide = ref(0);
const lightboxPhotos = ref<ActivityPhotoItem[]>([]);
const groupSlides = reactive<number[]>([0, 0, 0, 0, 0]);

let revealObserver: IntersectionObserver | undefined;

function openLightbox(photos: ActivityPhotoItem[], index: number): void {
  lightboxPhotos.value = photos;
  lightboxSlide.value = index;
  lightboxOpen.value = true;
}

function revealDelay(index: number): Record<string, string> {
  return { '--reveal-delay': `${index * 90}ms` };
}

function setupRevealObserver(): void {
  const revealElements = pageRoot.value?.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!revealElements?.length) return;

  revealObserver?.disconnect();
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
}

let liveSyncChannel: BroadcastChannel | null = null;

onMounted(async () => {
  await fetchPageData('home', editorLocale.value);
  setupRevealObserver();

  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    liveSyncChannel = new BroadcastChannel('botbuilder-live-sync');
    liveSyncChannel.onmessage = async (ev) => {
      if (ev.data?.type === 'content-saved') {
        await fetchPageData('home', editorLocale.value);
      }
    };
  }
});

watch(editorLocale, async (newLoc) => {
  await fetchPageData('home', newLoc);
});

onBeforeUnmount(() => {
  revealObserver?.disconnect();
  liveSyncChannel?.close();
});
</script>
