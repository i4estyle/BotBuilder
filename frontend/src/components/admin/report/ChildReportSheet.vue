<template>
  <!-- Rendered only while printing; teleported to <body> so print CSS can hide the rest of the app -->
  <Teleport to="body">
    <article class="bb-print-sheet" aria-hidden="true">
      <header class="sheet-header">
        <img :src="logo" alt="BotBuilder" class="sheet-logo" />
        <div class="sheet-title">
          <h1>รายงานพัฒนาการผู้เรียน</h1>
          <p>สมรรถนะ 7 ทักษะหลัก</p>
        </div>
        <div class="sheet-issued">ออกรายงาน<br />{{ issuedDate }}</div>
      </header>

      <section class="sheet-student">
        <div>
          <div class="label">ชื่อผู้เรียน</div>
          <div class="value value--name">{{ displayName }}</div>
        </div>
        <div v-if="child.courseTitle">
          <div class="label">หลักสูตร</div>
          <div class="value">{{ child.courseTitle }}</div>
        </div>
        <div>
          <div class="label">ความก้าวหน้า</div>
          <div class="value">
            {{ Math.min(child.completedSessions, 7) }} / 7 บทเรียน
            <span class="pill" :class="child.isCompleted7 ? 'pill--done' : 'pill--progress'">
              {{ child.isCompleted7 ? 'ครบหลักสูตร' : 'กำลังเรียน' }}
            </span>
          </div>
        </div>
        <div>
          <div class="label">คะแนนเฉลี่ยรวม</div>
          <div class="value value--score">
            {{ child.overallAverage > 0 ? child.overallAverage.toFixed(2) : '-' }}
            <small>/ 5.00</small>
          </div>
        </div>
      </section>

      <section class="sheet-skills">
        <div class="radar">
          <svg
            :viewBox="`${-LABEL_PAD} 0 ${SIZE + LABEL_PAD * 2} ${SIZE}`"
            role="img"
            aria-label="กราฟใยแมงมุม 7 ทักษะ"
          >
            <polygon v-for="ring in 5" :key="ring" :points="ringPoints(ring)" class="radar-ring" />
            <line
              v-for="(axis, i) in axes"
              :key="`axis-${i}`"
              :x1="CENTER"
              :y1="CENTER"
              :x2="axis.x"
              :y2="axis.y"
              class="radar-axis"
            />
            <polygon v-if="overallPoints" :points="overallPoints" class="radar-overall" />
            <polygon :points="childPoints" class="radar-child" />
            <circle
              v-for="(p, i) in childVertices"
              :key="`dot-${i}`"
              :cx="p.x"
              :cy="p.y"
              r="3"
              class="radar-dot"
            />
            <text
              v-for="(axis, i) in axes"
              :key="`label-${i}`"
              :x="axis.labelX"
              :y="axis.labelY"
              :text-anchor="axis.anchor"
              dominant-baseline="middle"
              class="radar-label"
            >
              {{ SKILL_DEFINITIONS[i]!.shortLabel }}
            </text>
          </svg>
          <div class="radar-legend">
            <span><i class="swatch swatch--child"></i>คะแนนผู้เรียน</span>
            <span v-if="overallPoints"
              ><i class="swatch swatch--overall"></i>ค่าเฉลี่ยทั้งรุ่น</span
            >
          </div>
        </div>

        <table class="skill-table">
          <thead>
            <tr>
              <th>ทักษะ</th>
              <th class="num">คะแนน</th>
              <th class="bar-col">ระดับ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="skill in SKILL_DEFINITIONS" :key="skill.key">
              <td>
                {{ skill.label }}
                <span v-if="topSkill?.key === skill.key" class="tag tag--top">เด่น</span>
                <span v-else-if="growthSkill?.key === skill.key" class="tag tag--grow"
                  >ส่งเสริม</span
                >
              </td>
              <td class="num">{{ scoreText(child.skillAverages[skill.key]) }}</td>
              <td class="bar-col">
                <div class="bar">
                  <div
                    class="bar-fill"
                    :style="{
                      width: `${((child.skillAverages[skill.key] || 0) / 5) * 100}%`,
                      background: skill.color,
                    }"
                  ></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-if="topSkill || growthSkill" class="sheet-summary">
        <div v-if="topSkill" class="summary-box summary-box--top">
          <div class="summary-head">ทักษะที่โดดเด่น</div>
          <div class="summary-skill">{{ topSkill.label }} ({{ scoreText(topSkill.avg) }})</div>
        </div>
        <div v-if="growthSkill" class="summary-box summary-box--grow">
          <div class="summary-head">ทักษะที่ควรส่งเสริมต่อ</div>
          <div class="summary-skill">
            {{ growthSkill.label }} ({{ scoreText(growthSkill.avg) }})
          </div>
        </div>
      </section>

      <section class="sheet-sessions">
        <h2>ผลการประเมินรายบทเรียน</h2>
        <table class="session-table">
          <thead>
            <tr>
              <th>บทที่</th>
              <th>วันที่</th>
              <th v-for="skill in SKILL_DEFINITIONS" :key="skill.key" class="num">
                {{ skill.shortLabel }}
              </th>
              <th class="num">เฉลี่ย</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rec in completedRecords" :key="rec.evaluationId">
              <td>{{ rec.sessionNumber ?? '-' }}</td>
              <td class="nowrap">{{ rec.sessionDate || '-' }}</td>
              <td v-for="skill in SKILL_DEFINITIONS" :key="skill.key" class="num">
                {{ rec.scores[skill.key] ?? '-' }}
              </td>
              <td class="num strong">{{ rec.averageScore ? rec.averageScore.toFixed(2) : '-' }}</td>
            </tr>
            <tr v-if="completedRecords.length === 0">
              <td :colspan="SKILL_DEFINITIONS.length + 3" class="empty">ยังไม่มีผลการประเมิน</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-if="notes.length" class="sheet-notes">
        <h2>ความเห็นจากผู้สอน</h2>
        <div v-for="note in notes" :key="note.id" class="note">
          <div class="note-head">
            บทเรียนที่ {{ note.session ?? '-' }}
            <span v-if="note.date">· {{ note.date }}</span>
          </div>
          <p>{{ note.text }}</p>
        </div>
      </section>

      <footer class="sheet-footer">
        BotBuilder · Code, Play &amp; Learn Robotics Through STEAM Education
      </footer>
    </article>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import logo from '@/assets/landing/logo.png';
import { SKILL_DEFINITIONS, type ChildSummary, type OverallStats } from '@/types/report';

const props = defineProps<{
  child: ChildSummary;
  overallStats?: OverallStats | undefined;
}>();

const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = 105;
const MAX_SCORE = 5;
// Extra horizontal room so side labels ("สร้างสรรค์", "สร้างหุ่น") stay inside the chart box
const LABEL_PAD = 30;

const issuedDate = new Date().toLocaleDateString('th-TH', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

// Sheet names carry an internal enrollment number ("#111 รอย"); parents only need the name
const displayName = computed(
  () => props.child.studentName.replace(/^#\d+\s*/, '') || props.child.studentName,
);

function scoreText(value: number | undefined): string {
  return value && value > 0 ? value.toFixed(2) : '-';
}

function point(index: number, ratio: number): { x: number; y: number } {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / SKILL_DEFINITIONS.length;
  return {
    x: CENTER + Math.cos(angle) * RADIUS * ratio,
    y: CENTER + Math.sin(angle) * RADIUS * ratio,
  };
}
const toPoints = (pts: { x: number; y: number }[]) =>
  pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

function ringPoints(ring: number): string {
  return toPoints(SKILL_DEFINITIONS.map((_, i) => point(i, ring / 5)));
}

const axes = computed(() =>
  SKILL_DEFINITIONS.map((_, i) => {
    const end = point(i, 1);
    const label = point(i, 1.22);
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
    point(i, Math.min((props.child.skillAverages[skill.key] || 0) / MAX_SCORE, 1)),
  ),
);
const childPoints = computed(() => toPoints(childVertices.value));

const overallPoints = computed(() => {
  const averages = props.overallStats?.skillAverages;
  if (!averages || !SKILL_DEFINITIONS.some((s) => (averages[s.key] || 0) > 0)) return null;
  return toPoints(
    SKILL_DEFINITIONS.map((skill, i) =>
      point(i, Math.min((averages[skill.key] || 0) / MAX_SCORE, 1)),
    ),
  );
});

const scoredSkills = computed(() =>
  SKILL_DEFINITIONS.map((s) => ({ ...s, avg: props.child.skillAverages[s.key] || 0 })).filter(
    (s) => s.avg > 0,
  ),
);
const topSkill = computed(() =>
  scoredSkills.value.length
    ? scoredSkills.value.reduce((best, s) => (s.avg > best.avg ? s : best))
    : null,
);
// Only point out a growth area when the scores actually differ
const growthSkill = computed(() => {
  if (scoredSkills.value.length < 2) return null;
  const low = scoredSkills.value.reduce((min, s) => (s.avg < min.avg ? s : min));
  return low.avg < (topSkill.value?.avg ?? 0) ? low : null;
});

const completedRecords = computed(() =>
  props.child.records.filter((r) => r.status.toLowerCase() === 'complete'),
);

// Parent-facing summary first; fall back to the teacher's evaluation comment
const notes = computed(() =>
  props.child.records
    .map((r) => ({
      id: r.evaluationId,
      session: r.sessionNumber,
      date: r.sessionDate,
      text: (r.aiMessage || r.comment || '').trim(),
    }))
    .filter((n) => n.text),
);
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
    margin: 12mm;
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
  color: #1e293b;
  font-size: 11.5px;
  line-height: 1.45;
}
.bb-print-sheet h1,
.bb-print-sheet h2,
.bb-print-sheet p {
  margin: 0;
}
.bb-print-sheet .sheet-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 10px;
  border-bottom: 3px solid #006c0c;
}
.bb-print-sheet .sheet-logo {
  height: 46px;
}
.bb-print-sheet .sheet-title {
  flex: 1;
}
.bb-print-sheet .sheet-title h1 {
  font-size: 20px;
  font-weight: 800;
  color: #006c0c;
}
.bb-print-sheet .sheet-title p {
  color: #64748b;
}
.bb-print-sheet .sheet-issued {
  text-align: right;
  color: #64748b;
  font-size: 10.5px;
}

.bb-print-sheet .sheet-student {
  display: grid;
  grid-template-columns: 1.4fr 1.4fr 1.2fr 1fr;
  gap: 10px;
  margin: 12px 0;
  padding: 10px 12px;
  background: #f1f8f2;
  border-radius: 8px;
}
.bb-print-sheet .label {
  font-size: 10px;
  color: #64748b;
}
.bb-print-sheet .value {
  font-weight: 700;
}
.bb-print-sheet .value--name {
  font-size: 14px;
  color: #006c0c;
}
.bb-print-sheet .value--score {
  font-size: 16px;
  color: #006c0c;
}
.bb-print-sheet .value small {
  font-weight: 400;
  color: #64748b;
}
.bb-print-sheet .pill {
  display: inline-block;
  margin-left: 4px;
  padding: 0 6px;
  border-radius: 999px;
  font-size: 9.5px;
  font-weight: 600;
}
.bb-print-sheet .pill--done {
  background: #dcfce7;
  color: #166534;
}
.bb-print-sheet .pill--progress {
  background: #fef3c7;
  color: #92400e;
}

.bb-print-sheet .sheet-skills {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 16px;
  align-items: center;
  break-inside: avoid;
}
.bb-print-sheet .radar svg {
  width: 100%;
  height: auto;
  overflow: visible;
}
.bb-print-sheet .radar-ring {
  fill: none;
  stroke: #e2e8f0;
  stroke-width: 1;
}
.bb-print-sheet .radar-axis {
  stroke: #e2e8f0;
  stroke-width: 1;
}
.bb-print-sheet .radar-overall {
  fill: none;
  stroke: #bc0100;
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
}
.bb-print-sheet .radar-child {
  fill: rgb(0 108 12 / 22%);
  stroke: #006c0c;
  stroke-width: 2;
}
.bb-print-sheet .radar-dot {
  fill: #006c0c;
}
.bb-print-sheet .radar-label {
  font-size: 11px;
  font-weight: 600;
  fill: #334155;
}
.bb-print-sheet .radar-legend {
  display: flex;
  justify-content: center;
  gap: 12px;
  font-size: 10px;
  color: #475569;
}
.bb-print-sheet .swatch {
  display: inline-block;
  width: 14px;
  height: 0;
  margin-right: 4px;
  vertical-align: middle;
  border-top: 2px solid #006c0c;
}
.bb-print-sheet .swatch--overall {
  border-top: 2px dashed #bc0100;
}

.bb-print-sheet table {
  width: 100%;
  border-collapse: collapse;
}
.bb-print-sheet th {
  text-align: left;
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
  border-bottom: 1px solid #cbd5e1;
  padding: 5px 6px;
}
.bb-print-sheet td {
  padding: 5px 6px;
  border-bottom: 1px solid #e2e8f0;
}
.bb-print-sheet .num {
  text-align: center;
}
.bb-print-sheet .strong {
  font-weight: 700;
  color: #006c0c;
}
.bb-print-sheet .nowrap {
  white-space: nowrap;
}
.bb-print-sheet .empty {
  text-align: center;
  color: #94a3b8;
}
.bb-print-sheet .bar-col {
  width: 38%;
}
.bb-print-sheet .bar {
  height: 7px;
  border-radius: 4px;
  background: #e2e8f0;
  overflow: hidden;
}
.bb-print-sheet .bar-fill {
  height: 100%;
  border-radius: 4px;
}
.bb-print-sheet .tag {
  margin-left: 4px;
  padding: 0 5px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
}
.bb-print-sheet .tag--top {
  background: #dcfce7;
  color: #166534;
}
.bb-print-sheet .tag--grow {
  background: #fee2e2;
  color: #991b1b;
}

.bb-print-sheet .sheet-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 12px 0;
  break-inside: avoid;
}
.bb-print-sheet .summary-box {
  padding: 8px 10px;
  border-radius: 8px;
}
.bb-print-sheet .summary-box--top {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}
.bb-print-sheet .summary-box--grow {
  background: #fef2f2;
  border: 1px solid #fecaca;
}
.bb-print-sheet .summary-head {
  font-size: 10px;
  font-weight: 700;
  color: #475569;
}
.bb-print-sheet .summary-skill {
  font-size: 13px;
  font-weight: 700;
}

.bb-print-sheet h2 {
  font-size: 13px;
  font-weight: 700;
  color: #006c0c;
  margin: 14px 0 6px;
}
.bb-print-sheet .session-table {
  font-size: 10.5px;
  break-inside: avoid;
}
.bb-print-sheet .note {
  padding: 6px 0;
  border-bottom: 1px solid #e2e8f0;
  break-inside: avoid;
}
.bb-print-sheet .note-head {
  font-weight: 700;
  font-size: 10.5px;
  color: #475569;
}
.bb-print-sheet .note p {
  white-space: pre-line;
}
.bb-print-sheet .sheet-footer {
  margin-top: 16px;
  padding-top: 6px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  font-size: 9.5px;
  color: #94a3b8;
}
</style>
