<template>
  <q-page class="landing-page">
    <main ref="pageRoot">
      <template v-for="item in navSections" :key="item.id">
        <SiteHeader v-if="item.id === 'header'" />

        <section v-else-if="item.id === 'hero'" class="hero" id="about">
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
              <p class="hero__image-caption">พื้นที่ให้เด็กได้สร้าง ทดลอง และแก้ปัญหาด้วยตัวเอง</p>
            </div>
          </div>
          <div class="hero__brandline" aria-label="BotBuilder highlights">
            <div><strong>Hands-on Learning</strong><span>สร้าง ทดลอง และเรียนรู้จากของจริง</span></div>
            <div><strong>Age 3–16</strong><span>เส้นทางการเรียนรู้ตามวัยและทักษะ</span></div>
            <div><strong>Build + Code</strong><span>เชื่อมการสร้าง กลไก และการเขียนโปรแกรม</span></div>
            <div><strong>Think + Explain</strong><span>ฝึกคิด แก้ปัญหา และอธิบายสิ่งที่ทำ</span></div>
          </div>
          <AdminSectionBlockLayer section-id="hero" />
        </section>

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
              เด็กไม่ได้ถูกวางให้นั่งดูครูสาธิต แต่ได้ลงมือกับโมเดล สนาม ภารกิจ
              และโปรแกรมของตัวเอง ครูทำหน้าที่ช่วยตั้งคำถามและช่วยให้เด็กคิดต่อ
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
          <div class="course-matcher__photo" data-reveal>
            <img
              :src="resolveAssetUrl('/src/assets/landing/inside1.jpg')"
              alt="เด็ก ๆ กำลังเรียนรู้และสร้างหุ่นยนต์"
            />
          </div>
          <div class="course-matcher__content" data-reveal>
            <p class="section-kicker">COURSE MATCHER</p>
            <h2>ลูกควรเริ่มตรงไหน?</h2>
            <p class="course-matcher__lead">
              อายุเป็นเพียงจุดเริ่มต้น ระดับที่เหมาะจริงควรดูทั้งความสนใจ สมาธิ การสร้าง
              การแก้ปัญหา และประสบการณ์ Coding เดิม
            </p>
            <div class="course-matcher__tabs" role="tablist" aria-label="เลือกช่วงอายุ">
              <button
                v-for="option in courseMatcherOptions"
                :key="option.id"
                type="button"
                :class="{ 'is-active': selectedCourseMatcher === option.id }"
                role="tab"
                :aria-selected="selectedCourseMatcher === option.id"
                @click="selectedCourseMatcher = option.id"
              >
                {{ option.age }}
              </button>
            </div>
            <article class="course-matcher__result">
              <p>{{ selectedCourseMatcherData.tag }}</p>
              <h3>{{ selectedCourseMatcherData.title }}</h3>
              <span>{{ selectedCourseMatcherData.description }}</span>
              <div class="course-matcher__skills">
                <span v-for="skill in selectedCourseMatcherData.skills" :key="skill">{{ skill }}</span>
              </div>
              <div class="course-matcher__path"><b>Learning path:</b> {{ selectedCourseMatcherData.path }}</div>
              <AppButton
                class="course-matcher__cta"
                @click="scrollToDiscoveryClass"
              >
                ให้ครูช่วยประเมินจากการทดลองจริง
              </AppButton>
            </article>
          </div>
          <AdminSectionBlockLayer section-id="courseMatcher" />
        </section>

        <section
          v-else-if="item.id === 'learningMethod'"
          class="section learning-method section--muted"
        >
          <div class="learning-method__content">
            <div class="learning-method__copy" data-reveal>
              <p class="section-kicker">HOW BOTBUILDER TEACHES</p>
              <h2>Build. Code. Solve. Present.</h2>
              <p>
                เป้าหมายของหนึ่งคลาสไม่ใช่ “ต่อเสร็จ” แต่คือเด็กเข้าใจว่าทำไมมันจึงทำงาน
                และรู้ว่าจะทำอย่างไรเมื่อครั้งแรกยังไม่สำเร็จ
              </p>
            </div>
            <ol class="learning-method__steps" data-reveal>
              <li>
                <span>01</span><h3>Build</h3>
                <p>เข้าใจโครงสร้าง กลไก เฟือง คาน ล้อ และการเคลื่อนไหวจากของจริง</p>
              </li>
              <li>
                <span>02</span><h3>Code</h3>
                <p>ใช้ Event, Input, Decision และ Action เพื่อควบคุมสิ่งที่ตัวเองสร้าง</p>
              </li>
              <li>
                <span>03</span><h3>Solve</h3>
                <p>Test → Fail → Fix เปลี่ยนทีละตัวแปร ทดลองซ้ำ และหาคำตอบจากผลจริง</p>
              </li>
              <li>
                <span>04</span><h3>Present</h3>
                <p>อธิบายโจทย์ วิธีทำ ปัญหาที่เจอ และสิ่งที่ปรับแก้ด้วยเหตุผลของตัวเอง</p>
              </li>
            </ol>
          </div>
          <div class="learning-method__photo" data-reveal>
            <img
              :src="resolveAssetUrl('/src/assets/landing/happyplaytime.png')"
              alt="ครูช่วยโค้ชนักเรียนระหว่างสร้างหุ่นยนต์"
            />
          </div>
          <AdminSectionBlockLayer section-id="learningMethod" />
        </section>

        <section v-else-if="item.id === 'studentProjects'" class="section student-projects">
          <div class="student-projects__intro" data-reveal>
            <p class="section-kicker">STUDENT WORK AS EVIDENCE</p>
            <h2>ผลงานไม่ใช่แค่ “ของที่ทำเสร็จ” แต่คือหลักฐานของวิธีคิด</h2>
            <p>
              ภาพเด็กและผลงานจริงควรเล่าโจทย์ การทดลอง และสิ่งที่เด็กแก้ไข
              มากกว่าการวางภาพโมเดลแบบ catalog
            </p>
          </div>
          <div class="student-projects__grid" data-reveal>
            <article class="student-projects__feature">
              <img
                :src="resolveAssetUrl('/src/assets/landing/exploringspace.png')"
                alt="เด็กกำลังโชว์ผลงานหุ่นยนต์"
              />
              <div class="student-projects__overlay">
                <span>STUDENT PROJECT</span>
                <h3>Build something you can explain</h3>
                <p>เด็กควรรู้ว่าชิ้นส่วนแต่ละส่วนทำอะไร และอธิบายเหตุผลของวิธีสร้างตัวเองได้</p>
              </div>
            </article>
            <div class="student-projects__stack">
              <article>
                <img
                  :src="resolveAssetUrl('/src/assets/landing/playlearn.png')"
                  alt="เด็กกำลังประกอบโมเดล"
                />
                <div class="student-projects__overlay">
                  <span>PROCESS</span><h3>From parts to idea</h3>
                </div>
              </article>
              <article>
                <img
                  :src="resolveAssetUrl('/src/assets/landing/roboticcamp.png')"
                  alt="บรรยากาศสนามหุ่นยนต์"
                />
                <div class="student-projects__overlay">
                  <span>MISSION</span><h3>Make it work in the real field</h3>
                </div>
              </article>
            </div>
          </div>
          <AdminSectionBlockLayer section-id="studentProjects" />
        </section>

        <section v-else-if="item.id === 'parentProof'" class="section parent-proof section--muted">
          <div class="parent-proof__photos" data-reveal>
            <img
              :src="resolveAssetUrl('/src/assets/landing/inside1.jpg')"
              alt="ครูและนักเรียนในคลาส BotBuilder"
            />
            <img
              :src="resolveAssetUrl('/src/assets/landing/exploringspace.png')"
              alt="เด็กกับผลงานหุ่นยนต์"
            />
            <img
              :src="resolveAssetUrl('/src/assets/landing/roboticcamp.png')"
              alt="เด็กทดลองหุ่นยนต์บนสนาม"
            />
          </div>
          <div class="parent-proof__copy" data-reveal>
            <p class="section-kicker">PROOF OVER CLAIMS</p>
            <h2>สิ่งที่ผู้ปกครองควรเห็นหลังเรียน</h2>
            <p class="parent-proof__lead">
              แทนคำว่า “พัฒนาความคิดสร้างสรรค์” เว็บไซต์ควรแสดงหลักฐานของพัฒนาการ
              เป็นเรื่องราวที่ดูได้จริง
            </p>
            <ul class="parent-proof__list">
              <li>
                <b>01</b>
                <span><strong>Student Project Case</strong><br />โจทย์ → วิธีออกแบบ → ปัญหา → วิธีแก้ → ผลลัพธ์</span>
              </li>
              <li>
                <b>02</b>
                <span><strong>Progress Feedback</strong><br />Focus · Sequence · Problem Solving · Creativity · Coding Level</span>
              </li>
              <li>
                <b>03</b>
                <span><strong>Before / After</strong><br />เทียบผลงานแรกกับผลงานปัจจุบัน เพื่อให้เห็นพัฒนาการจริง</span>
              </li>
              <li>
                <b>04</b>
                <span><strong>Student Voice</strong><br />ให้เด็กเป็นคนอธิบายผลงาน ไม่ใช่ให้แบรนด์พูดแทนทั้งหมด</span>
              </li>
            </ul>
          </div>
          <AdminSectionBlockLayer section-id="parentProof" />
        </section>

        <section
          v-else-if="item.id === 'discoveryClass'"
          id="discovery-class"
          class="section discovery-class"
        >
          <div class="discovery-class__photo" data-reveal>
            <img
              :src="resolveAssetUrl('/src/assets/landing/playlearn.png')"
              alt="เด็กกำลังทดลองเรียนหุ่นยนต์ที่ BotBuilder"
            />
            <div class="discovery-class__photo-caption">
              <span>ROBOTICS DISCOVERY CLASS</span>
              <strong>ให้เด็กได้สร้าง ลอง และอธิบายด้วยตัวเอง</strong>
            </div>
          </div>
          <div class="discovery-class__panel" data-reveal>
            <p class="section-kicker">ROBOTICS DISCOVERY CLASS</p>
            <h2>อย่าเดาว่าลูกเหมาะกับระดับไหน ให้เด็กได้ลองจริงก่อน</h2>
            <p class="discovery-class__lead">
              หลังทดลอง ผู้ปกครองจะได้รับ Feedback สั้น ๆ ว่าน้องสนใจอะไร ทำงานแบบไหน
              และ Learning Path ใดเหมาะที่สุด
            </p>
            <form class="discovery-class__form">
              <div class="discovery-class__form-grid">
                <label>
                  อายุของน้อง
                  <select aria-label="อายุของน้อง">
                    <option>3–5 ปี</option><option>6–9 ปี</option><option>10–12 ปี</option><option>13–16 ปี</option>
                  </select>
                </label>
                <label>
                  น้องสนใจอะไรที่สุด?
                  <select aria-label="สิ่งที่น้องสนใจ">
                    <option>ต่อของ / สร้างของ</option><option>หุ่นยนต์ / เครื่องจักร</option>
                    <option>เกม / Coding</option><option>การแข่งขัน / ภารกิจ</option><option>ยังไม่แน่ใจ</option>
                  </select>
                </label>
                <label>
                  ชื่อผู้ปกครอง
                  <input type="text" placeholder="ชื่อ" />
                </label>
                <label>
                  LINE / เบอร์โทร
                  <input type="text" placeholder="@LINE หรือเบอร์โทร" />
                </label>
              </div>
              <AppButton href="https://line.me/R/ti/p/@botbuilderthailand" class="discovery-class__cta">
                รับคำแนะนำ + จอง Discovery Class
              </AppButton>
              <small>ทีมครูจะช่วยแนะนำจากสิ่งที่น้องได้ลองทำจริง</small>
            </form>
          </div>
          <AdminSectionBlockLayer section-id="discoveryClass" />
        </section>

        <section v-else-if="item.id === 'faq'" class="section faq" id="faq">
          <div class="faq__intro" data-reveal>
            <p class="section-kicker">PARENT FAQ</p>
            <h2>คำถามก่อนเริ่มเรียน</h2>
            <p>เรื่องที่ผู้ปกครองมักสงสัยก่อนพาเด็ก ๆ มาลองสร้าง คิด และเขียนโค้ดจริง</p>
          </div>
          <div class="faq__items" data-reveal>
            <article class="faq__item" :class="{ 'is-open': openFaqIndex === 0 }">
              <button type="button" class="faq__question" :aria-expanded="openFaqIndex === 0" @click="openFaqIndex = openFaqIndex === 0 ? null : 0"><strong>ลูกยังอ่านไม่คล่อง เริ่ม Coding ได้ไหม?</strong><i aria-hidden="true" /></button>
              <div class="faq__answer"><p>ได้ครับ ระดับเริ่มต้นเรียนผ่านการสร้าง การเรียงลำดับ และ visual logic ก่อนเพิ่มความซับซ้อนของภาษาโปรแกรม</p></div>
            </article>
            <article class="faq__item" :class="{ 'is-open': openFaqIndex === 1 }">
              <button type="button" class="faq__question" :aria-expanded="openFaqIndex === 1" @click="openFaqIndex = openFaqIndex === 1 ? null : 1"><strong>ต้องเก่งคณิตศาสตร์ก่อนหรือไม่?</strong><i aria-hidden="true" /></button>
              <div class="faq__answer"><p>ไม่จำเป็น เราเริ่มจากการคิดเป็นขั้นตอน ทดลอง และแก้ปัญหา แล้วจึงค่อยเชื่อมความรู้ STEM เข้ากับภารกิจ</p></div>
            </article>
            <article class="faq__item" :class="{ 'is-open': openFaqIndex === 2 }">
              <button type="button" class="faq__question" :aria-expanded="openFaqIndex === 2" @click="openFaqIndex = openFaqIndex === 2 ? null : 2"><strong>ต่างจากการต่อ LEGO เล่นอย่างไร?</strong><i aria-hidden="true" /></button>
              <div class="faq__answer"><p>ทุกกิจกรรมมีโจทย์ การทดสอบ และการสะท้อนผล เด็กต้องทำให้สิ่งที่สร้างทำงานและอธิบายเหตุผลของตัวเองได้</p></div>
            </article>
            <article class="faq__item" :class="{ 'is-open': openFaqIndex === 3 }">
              <button type="button" class="faq__question" :aria-expanded="openFaqIndex === 3" @click="openFaqIndex = openFaqIndex === 3 ? null : 3"><strong>ถ้าลูกเรียนเร็วกว่าอายุล่ะ?</strong><i aria-hidden="true" /></button>
              <div class="faq__answer"><p>ครูจะเพิ่มความยากของโจทย์ โค้ด หรือฮาร์ดแวร์ตามความสามารถจริงของน้อง</p></div>
            </article>
          </div>
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import ActivityFormats from '@/components/landing/ActivityFormats.vue';
import AppButton from '@/components/landing/AppButton.vue';
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
  document.getElementById('discovery-class')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const pageRoot = ref<HTMLElement | null>(null);
const quizOpen = ref(false);
const openFaqIndex = ref<number | null>(null);
const selectedCourseMatcher = ref('little');
const courseMatcherOptions = [
  {
    id: 'little',
    age: '3–5 ปี',
    tag: 'LITTLE BUILDER',
    title: 'เริ่มคิดแบบ Coding โดยไม่ต้องรอให้อ่านคล่อง',
    description:
      'ฝึกสมาธิ กล้ามเนื้อมัดเล็ก ลำดับ รูปทรง ทิศทาง และความสัมพันธ์ระหว่างเหตุ–ผล ผ่านการสร้างและเล่นอย่างมีเป้าหมาย',
    skills: ['Fine Motor', 'Sequence', 'Focus', 'Cause & Effect'],
    path: 'Beginner → Intermediate',
  },
  {
    id: 'young',
    age: '6–9 ปี',
    tag: 'YOUNG CREATOR',
    title: 'จากเด็กที่ชอบต่อของ สู่เด็กที่ควบคุมสิ่งที่สร้างได้',
    description:
      'เพิ่มความคิดสร้างสรรค์ การแก้ปัญหา และ Coding ผ่านหุ่นยนต์ที่เคลื่อนไหว ตอบสนอง และทำภารกิจได้จริง',
    skills: ['Mechanism', 'Sensor', 'Block Coding', 'Creative Build'],
    path: 'Intermediate → Creator',
  },
  {
    id: 'challenge',
    age: '10–12 ปี',
    tag: 'ROBOT CHALLENGER',
    title: 'ไม่ใช่แค่สร้างเสร็จ แต่ต้องทำให้หุ่นยนต์แก้ Mission ได้',
    description: 'ฝึก Coding ที่เป็นระบบ การ Debug กลยุทธ์ภารกิจ และการนำเสนอ เพื่อรับโจทย์ที่ซับซ้อนขึ้น',
    skills: ['Algorithm', 'Navigation', 'Automation', 'Presentation'],
    path: 'Creator → Challenge → Competition',
  },
  {
    id: 'future',
    age: '13–16 ปี',
    tag: 'FUTURE DEVELOPER',
    title: 'เชื่อมหุ่นยนต์กับ Computing และ Engineering จริง',
    description:
      'ต่อยอดสู่ Micro:bit, Sensor, Algorithm, Control, Python และ Project Portfolio ที่ซับซ้อนขึ้น',
    skills: ['Micro:bit', 'Sensor', 'Control', 'Python'],
    path: 'Challenge → Micro:bit → Python / Portfolio',
  },
];
const defaultCourseMatcher = courseMatcherOptions[0]!;
const selectedCourseMatcherData = computed(
  () =>
    courseMatcherOptions.find((option) => option.id === selectedCourseMatcher.value) ||
    defaultCourseMatcher,
);

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
