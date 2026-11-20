<template>
  <!-- Rendered only while printing; teleported to <body> so print CSS can hide the rest of the app -->
  <Teleport to="body">
    <article class="bb-print-sheet" aria-hidden="true">
      <!-- Header -->
      <header class="rp-header">
        <img :src="logo" alt="BotBuilder" class="rp-logo" />
        <div class="rp-header-text">
          <div class="rp-doc-title">รายงานผลการเรียน</div>
          <div class="rp-doc-sub">โครงการสมรรถนะ 7 ทักษะ · BotBuilder Robotics</div>
        </div>
        <div class="rp-date">
          <div class="rp-muted">วันที่ออกรายงาน</div>
          <div>{{ issuedDate }}</div>
        </div>
      </header>

      <!-- Student -->
      <table class="rp-info">
        <tbody>
          <tr>
            <th>ชื่อผู้เรียน</th>
            <td>{{ displayName }}</td>
            <th>หลักสูตร</th>
            <td>{{ child.courseTitle || '–' }}</td>
          </tr>
          <tr>
            <th>จำนวนบทเรียน</th>
            <td>
              {{ sessionsDone }} จาก 7 บทเรียน
              <span class="rp-info-note">{{
                sessionsDone >= 7 ? '(ครบหลักสูตร)' : '(อยู่ระหว่างเรียน)'
              }}</span>
            </td>
            <th>ผลการเรียนโดยรวม</th>
            <td>
              <template v-if="child.overallAverage > 0">
                {{ child.overallAverage.toFixed(2) }} จาก 5.00 · ระดับ{{
                  levelOf(child.overallAverage)
                }}
              </template>
              <template v-else>ยังไม่มีผลการประเมิน</template>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Summary sentence -->
      <p class="rp-summary">{{ summarySentence }}</p>

      <!-- Skills -->
      <section class="rp-section">
        <h2 class="rp-h2">ผลการประเมิน 7 ทักษะ</h2>
        <div class="rp-skills">
          <svg
            class="rp-radar"
            :viewBox="`${-LABEL_PAD} ${-6} ${SIZE + LABEL_PAD * 2} ${SIZE + 12}`"
            role="img"
            aria-label="กราฟใยแมงมุม 7 ทักษะ"
          >
            <polygon
              v-for="ring in 5"
              :key="ring"
              :points="ringPoints(ring)"
              class="rp-radar-ring"
              :class="{ 'rp-radar-ring--outer': ring === 5 }"
            />
            <line
              v-for="(axis, i) in axes"
              :key="`axis-${i}`"
              :x1="CENTER"
              :y1="CENTER"
              :x2="axis.x"
              :y2="axis.y"
              class="rp-radar-axis"
            />
            <polygon :points="childPoints" class="rp-radar-shape" />
            <circle
              v-for="(p, i) in childVertices"
              :key="`dot-${i}`"
              :cx="p.x"
              :cy="p.y"
              r="2.6"
              class="rp-radar-point"
            />
            <text
              v-for="(axis, i) in axes"
              :key="`label-${i}`"
              :x="axis.labelX"
              :y="axis.labelY"
              :text-anchor="axis.anchor"
              dominant-baseline="middle"
              class="rp-radar-label"
            >
              {{ SKILL_DEFINITIONS[i]!.shortLabel }}
            </text>
          </svg>

          <table class="rp-skill-table">
            <tbody>
              <tr v-for="skill in skillRows" :key="skill.key">
                <td class="rp-skill-name">{{ skill.label }}</td>
                <td class="rp-skill-bar">
                  <div class="rp-bar">
                    <div class="rp-bar-fill" :style="{ width: `${(skill.avg / 5) * 100}%` }"></div>
                  </div>
                </td>
                <td class="rp-skill-score">{{ skill.avg > 0 ? skill.avg.toFixed(1) : '–' }}</td>
                <td class="rp-skill-level">
                  {{ skill.avg > 0 ? levelOf(skill.avg) : 'ยังไม่ประเมิน' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="rp-scale">
          เกณฑ์: 4.5–5 ดีเยี่ยม · 4.0–4.4 ดีมาก · 3.0–3.9 ดี · 2.0–2.9 พอใช้ · ต่ำกว่า 2 กำลังพัฒนา
        </div>
      </section>

      <!-- Strengths & growth -->
      <section v-if="strengths.length || growth.length" class="rp-section rp-two-col">
        <div v-if="strengths.length">
          <h2 class="rp-h2">จุดเด่นของน้อง</h2>
          <ul class="rp-list">
            <li v-for="s in strengths" :key="s.key">
              <strong>{{ s.label }}</strong> — {{ SKILL_COPY[s.key].strength }}
            </li>
          </ul>
        </div>
        <div v-if="growth.length">
          <h2 class="rp-h2">สิ่งที่ผู้ปกครองช่วยส่งเสริมได้</h2>
          <ul class="rp-list">
            <li v-for="s in growth" :key="s.key">
              <strong>{{ s.label }}</strong> — {{ SKILL_COPY[s.key].atHome }}
            </li>
          </ul>
        </div>
      </section>

      <!-- Progress across sessions -->
      <section class="rp-section">
        <h2 class="rp-h2">พัฒนาการรายบทเรียน (คะแนนเฉลี่ย)</h2>
        <table class="rp-session-table">
          <tbody>
            <tr>
              <th v-for="n in 7" :key="n">บทที่ {{ n }}</th>
            </tr>
            <tr>
              <td v-for="n in 7" :key="n" :class="{ 'rp-empty': sessionAverage(n) === null }">
                {{ sessionAverage(n)?.toFixed(2) ?? '–' }}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="trendText" class="rp-trend">{{ trendText }}</div>
      </section>

      <!-- Teacher comments -->
      <section v-if="notes.length" class="rp-section">
        <h2 class="rp-h2">ความเห็นจากครูผู้สอน</h2>
        <div v-for="note in notes" :key="note.id" class="rp-note">
          <div class="rp-note-head">
            บทเรียนที่ {{ note.session ?? '–' }}<span v-if="note.date"> · {{ note.date }}</span>
          </div>
          <p class="rp-note-text">{{ note.text }}</p>
        </div>
      </section>

      <!-- Signatures -->
      <footer class="rp-footer">
        <div class="rp-sign">
          <div class="rp-sign-line"></div>
          <div>ครูผู้สอน</div>
        </div>
        <div class="rp-sign">
          <div class="rp-sign-line"></div>
          <div>ผู้ปกครอง</div>
        </div>
      </footer>
      <div class="rp-brand">
        BotBuilder · Code, Play &amp; Learn Robotics Through STEAM Education
      </div>
    </article>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import logo from '@/assets/landing/logo.png';
import { SKILL_DEFINITIONS, type ChildSummary, type SkillMeta } from '@/types/report';
import { sheetDateValue } from '@/utils/sheet-date';

const props = defineProps<{
  child: ChildSummary;
}>();

type SkillKey = SkillMeta['key'];

/** Plain-language copy for parents: what a strong score means, and what helps at home. */
const SKILL_COPY: Record<SkillKey, { strength: string; atHome: string }> = {
  score1: {
    strength: 'จดจ่อกับกิจกรรมได้ต่อเนื่อง และทำงานจนสำเร็จ',
    atHome: 'ชวนทำกิจกรรมที่ใช้เวลาต่อเนื่อง เช่น ต่อจิ๊กซอว์ หรืออ่านนิทานด้วยกันจนจบเรื่อง',
  },
  score2: {
    strength: 'ใช้มือหยิบจับและประกอบชิ้นส่วนเล็ก ๆ ได้คล่องแคล่ว',
    atHome: 'ฝึกกิจกรรมที่ใช้มือ เช่น ต่อตัวต่อ ปั้นดินน้ำมัน หรือวาดและระบายสี',
  },
  score3: {
    strength: 'เข้าใจโครงสร้างและประกอบหุ่นยนต์ได้ตามแบบอย่างมั่นใจ',
    atHome: 'ชวนต่อบล็อกหรือของเล่นประกอบ แล้วให้น้องเล่าว่าแต่ละชิ้นทำหน้าที่อะไร',
  },
  score4: {
    strength: 'เข้าใจลำดับคำสั่งและคิดอย่างเป็นเหตุเป็นผล',
    atHome: 'เล่นเกมเรียงลำดับขั้นตอน เช่น ให้น้องบอกทางทีละคำสั่ง หรือเรียงขั้นตอนกิจวัตรประจำวัน',
  },
  score5: {
    strength: 'ลองหาวิธีใหม่เมื่อเจออุปสรรค และไม่ยอมแพ้ง่าย',
    atHome: 'เมื่อน้องเจอปัญหา ลองถามว่า "มีวิธีอื่นอีกไหม" ก่อนเข้าไปช่วย',
  },
  score6: {
    strength: 'มีไอเดียเป็นของตัวเอง และต่อยอดผลงานได้อย่างสร้างสรรค์',
    atHome: 'เปิดโอกาสให้น้องออกแบบหรือดัดแปลงของเล่นตามจินตนาการของตัวเอง',
  },
  score7: {
    strength: 'เล่าและอธิบายผลงานของตัวเองได้อย่างมั่นใจ',
    atHome: 'ชวนน้องเล่าสิ่งที่ทำในห้องเรียนให้ฟัง และชื่นชมเมื่อน้องอธิบายได้',
  },
};

const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = 88;
const LABEL_PAD = 34;

const issuedDate = new Date().toLocaleDateString('th-TH', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

// Sheet names carry an internal enrollment number ("#111 รอย"); parents only need the name
const displayName = computed(
  () => props.child.studentName.replace(/^#\d+\s*/, '') || props.child.studentName,
);

function levelOf(score: number): string {
  if (!score || score <= 0) return '–';
  if (score >= 4.5) return 'ดีเยี่ยม';
  if (score >= 4) return 'ดีมาก';
  if (score >= 3) return 'ดี';
  if (score >= 2) return 'พอใช้';
  return 'กำลังพัฒนา';
}

/* ---------- radar ---------- */
function point(index: number, ratio: number): { x: number; y: number } {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / SKILL_DEFINITIONS.length;
  return {
    x: CENTER + Math.cos(angle) * RADIUS * ratio,
    y: CENTER + Math.sin(angle) * RADIUS * ratio,
  };
}
const toPoints = (pts: { x: number; y: number }[]) =>
  pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
const ringPoints = (ring: number) => toPoints(SKILL_DEFINITIONS.map((_, i) => point(i, ring / 5)));

const axes = computed(() =>
  SKILL_DEFINITIONS.map((_, i) => {
    const end = point(i, 1);
    const label = point(i, 1.2);
    const dx = label.x - CENTER;
    return {
      ...end,
      labelX: label.x,
      labelY: label.y,
      anchor: Math.abs(dx) < 8 ? 'middle' : dx > 0 ? 'start' : 'end',
    };
  }),
);
const childVertices = computed(() =>
  SKILL_DEFINITIONS.map((skill, i) =>
    point(i, Math.min((props.child.skillAverages[skill.key] || 0) / 5, 1)),
  ),
);
const childPoints = computed(() => toPoints(childVertices.value));

/* ---------- skills ---------- */
const skillRows = computed(() =>
  SKILL_DEFINITIONS.map((s) => ({ ...s, avg: props.child.skillAverages[s.key] || 0 })),
);
const scored = computed(() =>
  [...skillRows.value].filter((s) => s.avg > 0).sort((a, b) => b.avg - a.avg),
);
// Up to two clear strengths (scored "ดี" or better)
const strengths = computed(() => scored.value.filter((s) => s.avg >= 3).slice(0, 2));
// Up to two lowest skills that sit below the top score; never repeat a strength
const growth = computed(() => {
  const top = scored.value[0]?.avg ?? 0;
  const picked = new Set(strengths.value.map((s) => s.key));
  return [...scored.value]
    .reverse()
    .filter((s) => s.avg < top && !picked.has(s.key))
    .slice(0, 2);
});

/* ---------- sessions ---------- */
const completedRecords = computed(() =>
  props.child.records.filter((r) => r.status.toLowerCase() === 'complete' && r.averageScore > 0),
);
const sessionsDone = computed(
  () => new Set(completedRecords.value.map((r) => r.sessionNumber).filter((n) => n !== null)).size,
);
function sessionAverage(n: number): number | null {
  const recs = completedRecords.value.filter((r) => r.sessionNumber === n);
  if (!recs.length) return null;
  return recs.reduce((sum, r) => sum + r.averageScore, 0) / recs.length;
}

const trendText = computed(() => {
  const values = Array.from({ length: 7 }, (_, i) => sessionAverage(i + 1)).filter(
    (v): v is number => v !== null,
  );
  if (values.length < 2) return '';
  const diff = values[values.length - 1]! - values[0]!;
  if (diff >= 0.1)
    return `คะแนนเฉลี่ยบทเรียนล่าสุดสูงขึ้น ${diff.toFixed(2)} คะแนน เมื่อเทียบกับบทเรียนแรก`;
  if (diff <= -0.1)
    return `คะแนนบทเรียนล่าสุดลดลง ${Math.abs(diff).toFixed(2)} คะแนน เมื่อเทียบกับบทเรียนแรก ครูจะช่วยติดตามอย่างใกล้ชิด`;
  return 'คะแนนมีความสม่ำเสมอตลอดบทเรียนที่ผ่านมา';
});

const summarySentence = computed(() => {
  const name = `น้อง${displayName.value}`;
  const done = sessionsDone.value;
  if (!scored.value.length) return `${name} เริ่มเรียนแล้ว และยังไม่มีผลการประเมินในขณะนี้`;
  const progress =
    done >= 7 ? 'เรียนครบทั้ง 7 บทเรียนของหลักสูตรแล้ว' : `เรียนไปแล้ว ${done} จาก 7 บทเรียน`;
  const level = `ภาพรวมอยู่ในระดับ "${levelOf(props.child.overallAverage)}"`;
  const best = strengths.value.map((s) => s.label);
  const bestText = best.length ? ` โดยโดดเด่นด้าน${best.join('และ')}` : '';
  return `${name} ${progress} ${level}${bestText}`;
});

/* ---------- teacher comments (latest two, parent-facing text first) ---------- */
const notes = computed(() => {
  const withText = props.child.records
    .map((r) => ({
      id: r.evaluationId,
      session: r.sessionNumber,
      date: r.sessionDate,
      order: sheetDateValue(r.sessionDate),
      text: (r.aiMessage || r.comment || '').trim(),
    }))
    .filter((n) => n.text)
    .sort((a, b) => (a.session ?? 0) - (b.session ?? 0) || a.order - b.order);
  return withText.slice(-2);
});
</script>

<style>
/* Global (unscoped) so they can target <body> and the teleported sheet */
@media screen {
  .bb-print-sheet {
    display: none;
  }
}
@media print {
  @page {
    size: A4;
    margin: 14mm 15mm;
  }
  body.bb-printing > *:not(.bb-print-sheet) {
    display: none !important;
  }
  /* An open QDialog locks scrolling by shifting <body> up by the scroll offset
     (inline top/left + fixed position); undo it or the sheet prints off-page */
  body.bb-printing {
    position: static !important;
    top: 0 !important;
    left: 0 !important;
    overflow: visible !important;
    background: #fff !important;
  }
  .bb-print-sheet {
    display: block;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

.bb-print-sheet {
  --rp-accent: #006c0c;
  --rp-ink: #1f2933;
  --rp-muted: #6b7280;
  --rp-line: #e5e7eb;
  font-family: 'Sarabun', 'Noto Sans Thai', sans-serif;
  color: var(--rp-ink);
  font-size: 12px;
  line-height: 1.5;
}
.bb-print-sheet h2,
.bb-print-sheet p,
.bb-print-sheet ul {
  margin: 0;
}
.bb-print-sheet .rp-muted {
  color: var(--rp-muted);
  font-size: 10.5px;
}

/* Header */
.bb-print-sheet .rp-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 12px;
  border-bottom: 1.5px solid var(--rp-accent);
}
.bb-print-sheet .rp-logo {
  height: 40px;
}
.bb-print-sheet .rp-header-text {
  flex: 1;
}
.bb-print-sheet .rp-doc-title {
  font-size: 19px;
  font-weight: 700;
  letter-spacing: 0.2px;
}
.bb-print-sheet .rp-doc-sub {
  color: var(--rp-muted);
  font-size: 11px;
}
.bb-print-sheet .rp-date {
  text-align: right;
  font-size: 11.5px;
}

/* Student information: a plain bordered form-style table */
.bb-print-sheet .rp-info {
  width: 100%;
  margin-top: 14px;
  border-collapse: collapse;
  table-layout: fixed;
}
.bb-print-sheet .rp-info th,
.bb-print-sheet .rp-info td {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  text-align: left;
  vertical-align: middle;
}
.bb-print-sheet .rp-info th {
  width: 19%;
  font-weight: 600;
  color: #374151;
  background: #f7f8f9;
}
.bb-print-sheet .rp-info td {
  width: 31%;
}
.bb-print-sheet .rp-info-note {
  color: var(--rp-muted);
}

.bb-print-sheet .rp-summary {
  margin-top: 10px;
  text-indent: 2em;
}

/* Sections */
.bb-print-sheet .rp-section {
  margin-top: 13px;
  break-inside: avoid;
}
.bb-print-sheet .rp-h2 {
  /* Quasar's global h2 sets a 3.75rem line-height and letter-spacing; reset them */
  line-height: 1.4;
  letter-spacing: normal;
  font-size: 13px;
  font-weight: 700;
  padding-bottom: 4px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--rp-line);
}
.bb-print-sheet .rp-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}

/* Skills */
.bb-print-sheet .rp-skills {
  display: grid;
  grid-template-columns: 210px 1fr;
  gap: 20px;
  align-items: center;
}
.bb-print-sheet .rp-radar {
  width: 100%;
  height: auto;
}
.bb-print-sheet .rp-radar-ring {
  fill: none;
  stroke: var(--rp-line);
  stroke-width: 0.8;
}
.bb-print-sheet .rp-radar-ring--outer {
  stroke: #d1d5db;
}
.bb-print-sheet .rp-radar-axis {
  stroke: var(--rp-line);
  stroke-width: 0.8;
}
.bb-print-sheet .rp-radar-shape {
  fill: rgb(0 108 12 / 16%);
  stroke: var(--rp-accent);
  stroke-width: 1.6;
  stroke-linejoin: round;
}
.bb-print-sheet .rp-radar-point {
  fill: var(--rp-accent);
}
.bb-print-sheet .rp-radar-label {
  font-family: 'Sarabun', 'Noto Sans Thai', sans-serif;
  font-size: 10.5px;
  fill: #374151;
}
.bb-print-sheet .rp-skill-table {
  width: 100%;
  border-collapse: collapse;
}
.bb-print-sheet .rp-skill-table td {
  padding: 3.5px 0;
  border-bottom: 1px solid #f0f1f3;
  vertical-align: middle;
}
.bb-print-sheet .rp-skill-name {
  width: 34%;
}
.bb-print-sheet .rp-skill-bar {
  padding-right: 12px !important;
}
.bb-print-sheet .rp-bar {
  height: 6px;
  border-radius: 3px;
  background: #eceff1;
  overflow: hidden;
}
.bb-print-sheet .rp-bar-fill {
  height: 100%;
  border-radius: 3px;
  background: var(--rp-accent);
}
.bb-print-sheet .rp-skill-score {
  width: 34px;
  text-align: right;
  font-weight: 700;
}
.bb-print-sheet .rp-skill-level {
  width: 82px;
  text-align: right;
  color: var(--rp-muted);
}
.bb-print-sheet .rp-scale {
  margin-top: 6px;
  font-size: 9.5px;
  color: var(--rp-muted);
  text-align: right;
}

/* Lists */
.bb-print-sheet .rp-list {
  padding-left: 16px;
}
.bb-print-sheet .rp-list li {
  margin-bottom: 4px;
}

/* Sessions */
.bb-print-sheet .rp-session-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: center;
}
.bb-print-sheet .rp-session-table th {
  font-weight: 400;
  font-size: 10.5px;
  color: var(--rp-muted);
  padding: 3px 0;
}
.bb-print-sheet .rp-session-table td {
  font-weight: 700;
  padding: 6px 0;
  border: 1px solid var(--rp-line);
}
.bb-print-sheet .rp-session-table td.rp-empty {
  font-weight: 400;
  color: #c0c6cc;
}
.bb-print-sheet .rp-trend {
  margin-top: 6px;
  font-size: 11px;
  color: var(--rp-muted);
}

/* Notes */
.bb-print-sheet .rp-note + .rp-note {
  margin-top: 8px;
}
.bb-print-sheet .rp-note-head {
  font-size: 10.5px;
  color: var(--rp-muted);
}
.bb-print-sheet .rp-note-text {
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Footer */
.bb-print-sheet .rp-footer {
  display: flex;
  justify-content: space-between;
  gap: 60px;
  margin-top: 22px;
  break-inside: avoid;
}
.bb-print-sheet .rp-sign {
  flex: 1;
  max-width: 220px;
  text-align: center;
  font-size: 11px;
  color: var(--rp-muted);
}
.bb-print-sheet .rp-sign-line {
  height: 26px;
  border-bottom: 1px dotted #9ca3af;
  margin-bottom: 4px;
}
.bb-print-sheet .rp-brand {
  margin-top: 18px;
  text-align: center;
  font-size: 9px;
  color: #9ca3af;
}
</style>
