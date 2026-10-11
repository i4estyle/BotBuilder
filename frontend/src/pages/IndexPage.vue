<template>
  <q-page class="landing-page">
    <main ref="pageRoot">
      <template v-for="item in navSections" :key="item.id">
        <SiteHeader v-if="item.id === 'header'" />

        <template v-else-if="item.id === 'hero'">
          <section class="hero" id="about">
            <div class="hero__copy" data-reveal>
              <p class="hero__kicker">Robotics Design Studio for Kids</p>
              <h1>
                <span :style="getStyleOverride('hero.titleHighlight')">{{
                  heroData.titleHighlight
                }}</span
                ><span :style="getStyleOverride('hero.titleRest')">{{ heroData.titleRest }}</span>
              </h1>
              <p :style="getStyleOverride('hero.paragraph')">{{ heroData.paragraph }}</p>
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
            <div class="hero__image-frame">
              <div class="hero__image-inner" :style="getStyleOverride('hero.image')">
                <img :src="resolveAssetUrl(heroData.image)" :alt="heroData.imageAlt" />
                <p class="hero__image-caption">
                  พื้นที่ให้เด็กได้สร้าง ทดลอง และแก้ปัญหาด้วยตัวเอง
                </p>
              </div>
            </div>
            <AdminSectionBlockLayer section-id="hero" />
          </section>
          <div class="hero__brandline" aria-label="BotBuilder highlights">
            <div class="hero__brandline-grid">
              <div>
                <strong>Hands-on Learning</strong><span>สร้าง ทดลอง และเรียนรู้จากของจริง</span>
              </div>
              <div><strong>Age 3–16</strong><span>เส้นทางการเรียนรู้ตามวัยและทักษะ</span></div>
              <div>
                <strong>Build + Code</strong><span>เชื่อมการสร้าง กลไก และการเขียนโปรแกรม</span>
              </div>
              <div>
                <strong>Think + Explain</strong><span>ฝึกคิด แก้ปัญหา และอธิบายสิ่งที่ทำ</span>
              </div>
            </div>
          </div>
        </template>

        <section
          v-else-if="item.id === 'activityFormats'"
          class="section activity-experience"
          id="activity-formats"
        >
          <div class="activity-experience__intro" data-reveal>
            <p class="section-kicker">WHAT LEARNING REALLY LOOKS LIKE</p>
            <SectionHeading
              :title="activityFormatsData.heading"
              :style="getStyleOverride('activityFormats.heading')"
              :centered="false"
            />
            <p>
              เด็กไม่ได้ถูกวางให้นั่งดูครูสาธิต แต่ได้ลงมือกับโมเดล สนาม ภารกิจ และโปรแกรมของตัวเอง
              ครูทำหน้าที่ช่วยตั้งคำถามและช่วยให้เด็กคิดต่อ
            </p>
          </div>
          <ActivityFormats :items="activityFormatsData.items" />
          <AdminSectionBlockLayer section-id="activityFormats" />
        </section>

        <section
          v-else-if="item.id === 'courseMatcher'"
          class="section course-matcher course-matcher--interactive"
          id="course-matcher"
        >
          <HomeCourseMatcherSection @request-assessment="scrollToDiscoveryClass" />
          <AdminSectionBlockLayer section-id="courseMatcher" />
        </section>

        <section
          v-else-if="item.id === 'learningMethod'"
          class="section learning-method section--muted"
        >
          <HomeLearningMethodSection />
          <AdminSectionBlockLayer section-id="learningMethod" />
        </section>

        <section v-else-if="item.id === 'studentProjects'" class="section student-projects">
          <HomeStudentProjectsSection />
          <AdminSectionBlockLayer section-id="studentProjects" />
        </section>

        <section v-else-if="item.id === 'parentProof'" class="section parent-proof section--muted">
          <HomeParentProofSection />
          <AdminSectionBlockLayer section-id="parentProof" />
        </section>

        <section
          v-else-if="item.id === 'discoveryClass'"
          id="discovery-class"
          class="section discovery-class"
        >
          <HomeDiscoveryClassSection />
          <AdminSectionBlockLayer section-id="discoveryClass" />
        </section>

        <section v-else-if="item.id === 'faq'" class="section faq" id="faq">
          <HomeFaqSection />
          <AdminSectionBlockLayer section-id="faq" />
        </section>

        <section v-else-if="item.id === 'quiz'" class="quiz section" data-reveal>
          <q-icon name="quiz" class="quiz__icon" :style="getStyleOverride('quiz.icon')" />
          <h2 :style="getStyleOverride('quiz.heading')">{{ quizData.heading }}</h2>
          <p :style="getStyleOverride('quiz.paragraph')">{{ quizData.paragraph }}</p>
          <AppButton @click="quizOpen = true">
            <span :style="getStyleOverride('quiz.cta')">{{ quizData.cta }}</span>
          </AppButton>
          <AdminSectionBlockLayer section-id="quiz" />
        </section>

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
                      >{{ editorLocale === 'th-TH' ? 'โทร. ' : 'Tel. ' }}
                      <span :style="getStyleOverride(`branches.items.${index}.phone`)">{{
                        branch.phone
                      }}</span>
                      ({{ editorLocale === 'th-TH' ? 'ครู' : 'Teacher '
                      }}<span :style="getStyleOverride(`branches.items.${index}.contactName`)">{{
                        branch.contactName
                      }}</span
                      >)</span
                    >
                  </a>
                </div>
              </article>
            </div>
          </div>
          <AdminSectionBlockLayer section-id="branches" />
        </section>

        <section v-else-if="item.id === 'cta'" class="cta" id="contact" data-reveal>
          <div class="cta__dots" />
          <h2 :style="getStyleOverride('cta.heading')">{{ ctaData.heading }}</h2>
          <p :style="getStyleOverride('cta.paragraph')">{{ ctaData.paragraph }}</p>
          <AppButton variant="green" href="https://line.me/R/ti/p/@botbuilderthailand">
            <span :style="getStyleOverride('cta.button')">{{ ctaData.button }}</span>
          </AppButton>
          <AdminSectionBlockLayer section-id="cta" />
        </section>

        <SiteFooter v-else-if="item.id === 'footer'" />

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
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import ActivityFormats from '@/components/landing/ActivityFormats.vue';
import AppButton from '@/components/landing/AppButton.vue';
import HomeCourseMatcherSection from '@/components/landing/home/home-course-matcher-section.vue';
import HomeLearningMethodSection from '@/components/landing/home/home-learning-method-section.vue';
import HomeStudentProjectsSection from '@/components/landing/home/home-student-projects-section.vue';
import HomeParentProofSection from '@/components/landing/home/home-parent-proof-section.vue';
import HomeDiscoveryClassSection from '@/components/landing/home/home-discovery-class-section.vue';
import HomeFaqSection from '@/components/landing/home/home-faq-section.vue';
import QuizPanel from '@/components/landing/QuizPanel.vue';
import SectionHeading from '@/components/landing/SectionHeading.vue';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { resolveAssetUrl } from '@/utils/asset-helper';

const {
  hero: heroData,
  activityFormats: activityFormatsData,
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

function scrollToDiscoveryClass(): void {
  document
    .getElementById('discovery-class')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const pageRoot = ref<HTMLElement | null>(null);
const quizOpen = ref(false);

let revealObserver: IntersectionObserver | undefined;

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
