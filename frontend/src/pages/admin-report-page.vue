<template>
  <q-page class="q-pa-md q-pa-md-lg admin-report-page">
    <!-- Header -->
    <div
      class="row items-start justify-between q-col-gutter-sm q-mb-lg header-wrap"
      :class="{ 'header-wrap--with-toggle': !isDrawerOpen }"
    >
      <div class="col-12 col-md">
        <h1 class="page-title text-grey-10 q-my-none">
          รายงานและวิเคราะห์สมรรถนะผู้เรียน 7 ทักษะหลัก
        </h1>
        <div class="header-meta text-caption text-grey-7">
          <span class="live-badge">
            <span class="live-dot"></span>
            Google Sheets
          </span>
          <span class="meta-item">อัปเดตล่าสุด {{ formatTime(store.lastUpdated) }}</span>
        </div>
        <div class="text-caption text-grey-6 q-mt-xs">สมรรถนะ 7 ด้าน: {{ skillNames }}</div>
      </div>

      <div class="col-12 col-md-auto">
        <div class="header-actions">
          <q-btn
            outline
            no-caps
            color="grey-8"
            icon="table_rows"
            label="ตารางบันทึกดิบ"
            to="/admin/evaluations"
            class="action-pill"
          />
          <q-btn
            outline
            no-caps
            color="primary"
            icon="open_in_new"
            :label="$q.screen.lt.sm ? 'Google Sheet' : 'เปิด Google Sheet'"
            :href="sheetUrl"
            target="_blank"
            class="action-pill"
          />
        </div>
      </div>
    </div>

    <!-- Error Banner -->
    <q-banner
      v-if="store.errorMessage"
      class="bg-negative text-white q-mb-md rounded-borders shadow-1"
    >
      <template #avatar>
        <q-icon name="error_outline" size="md" />
      </template>
      <div class="text-subtitle2">เกิดข้อผิดพลาดในการดึงข้อมูลจาก Google Sheets:</div>
      <div>{{ store.errorMessage }}</div>
      <template #action>
        <q-btn flat color="white" label="ลองใหม่อีกครั้ง" @click="() => store.fetchEvaluations()" />
      </template>
    </q-banner>

    <!-- Main Content -->
    <div v-if="!store.isLoading || store.records.length > 0">
      <!-- 1. KPI Overview Cards -->
      <ReportOverviewCards :stats="store.overallStats" />

      <!-- 2. Charts Row 1: Radar Chart + Skill Bar Chart -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-lg-6">
          <OverallRadarChart :stats="store.overallStats" />
        </div>
        <div class="col-12 col-lg-6">
          <SkillBarChart :stats="store.overallStats" />
        </div>
      </div>

      <!-- 3. Charts Row 2: Completion Donut + Academic Insights -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-lg-5">
          <CompletionDonutChart :stats="store.overallStats" />
        </div>

        <!-- Academic Analytics Insights Box -->
        <div class="col-12 col-lg-7">
          <q-card flat bordered class="insights-card full-height">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold text-grey-9 row items-center q-mb-xs">
                <q-icon name="insights" color="primary" size="20px" class="q-mr-xs" />
                บทวิเคราะห์และข้อเสนอแนะเชิงวิชาการ (Academic Insights)
              </div>
              <div class="text-caption text-grey-7 q-mb-md">
                สรุปจากบันทึกการประเมินผลทั้งหมด
                {{ store.overallStats.totalEvaluations.toLocaleString() }} รายการ
              </div>

              <div class="row q-col-gutter-sm">
                <!-- Highest Skill -->
                <div class="col-12 col-sm-6">
                  <q-card flat bordered class="q-pa-md bg-green-1 border-green">
                    <div class="text-caption text-bb-green text-weight-bold row items-center">
                      <q-icon name="star" size="16px" class="q-mr-xs" />
                      สมรรถนะที่ผู้เรียนโดดเด่นสูงสุด
                    </div>
                    <div class="text-h6 text-weight-bolder text-bb-green q-mt-xs">
                      <template v-if="topSkill">
                        {{ topSkill.label }} ({{ topSkill.avg }} / 5.0)
                      </template>
                      <template v-else>-</template>
                    </div>
                    <div class="text-caption text-grey-8 q-mt-xs">
                      ผู้เรียนส่วนใหญ่มีความพร้อมและแสดงศักยภาพด้านนี้ได้สม่ำเสมอ
                    </div>
                  </q-card>
                </div>

                <!-- Growth Skill -->
                <div class="col-12 col-sm-6">
                  <q-card flat bordered class="q-pa-md bg-red-1 border-red">
                    <div class="text-caption text-bb-red text-weight-bold row items-center">
                      <q-icon name="trending_up" size="16px" class="q-mr-xs" />
                      สมรรถนะที่แนะนำให้ส่งเสริมพัฒนา
                    </div>
                    <div class="text-h6 text-weight-bolder text-bb-red q-mt-xs">
                      <template v-if="lowestSkill">
                        {{ lowestSkill.label }} ({{ lowestSkill.avg }} / 5.0)
                      </template>
                      <template v-else>-</template>
                    </div>
                    <div class="text-caption text-grey-8 q-mt-xs">
                      แนะนำให้จัดกิจกรรมเสริมเฉพาะกลุ่มเพื่อพัฒนาทักษะนี้ในบทเรียนถัดไป
                    </div>
                  </q-card>
                </div>

                <!-- 7 Topics Completed Milestone -->
                <div class="col-12 q-mt-sm">
                  <q-card flat bordered class="q-pa-md bg-white border">
                    <div class="row items-center justify-between q-col-gutter-sm">
                      <div>
                        <div class="text-caption text-bb-green text-weight-bold row items-center">
                          <q-icon name="verified" size="16px" class="q-mr-xs" />
                          เป้าหมายความสำเร็จหลักสูตร 7 บทเรียน
                        </div>
                        <div class="text-body2 text-grey-9 q-mt-xs">
                          มีผู้เรียนสำเร็จครบ 7 บทเรียนแล้ว
                          <span class="text-weight-bold text-bb-green"
                            >{{ store.overallStats.fullyCompletedChildren }} คน</span
                          >
                          จากทั้งหมด {{ store.overallStats.totalChildren }} คน (คิดเป็น
                          {{ completionPercent }}% ของรุ่น)
                        </div>
                      </div>
                      <q-btn
                        flat
                        dense
                        no-caps
                        color="primary"
                        label="ดูรายชื่อ"
                        icon-right="arrow_downward"
                        @click="scrollToChildren"
                      />
                    </div>
                  </q-card>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- 4. Children Table -->
      <div id="children-table" class="q-mt-lg">
        <ChildrenTable :children="store.childrenSummaries" @select-child="openChildDetail" />
      </div>
    </div>

    <!-- Loading Skeleton / Spinner -->
    <div v-else class="text-center q-pa-xl">
      <q-spinner-cube size="56px" color="primary" />
      <div class="text-subtitle2 text-grey-7 q-mt-md">
        กำลังประมวลผลข้อมูลสารสนเทศจาก Google Sheets...
      </div>
    </div>

    <!-- Child Detail Dialog Modal -->
    <ChildDetailDialog
      v-model="showChildModal"
      :child="selectedChild"
      :overall-stats="store.overallStats"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { useEvaluationStore } from '@/stores/evaluation-store';
import { useAdminDrawer } from '@/composables/use-admin-drawer';
import { SKILL_DEFINITIONS, type ChildSummary } from '@/types/report';
import ReportOverviewCards from '@/components/admin/report/ReportOverviewCards.vue';
import OverallRadarChart from '@/components/admin/report/OverallRadarChart.vue';
import SkillBarChart from '@/components/admin/report/SkillBarChart.vue';
import CompletionDonutChart from '@/components/admin/report/CompletionDonutChart.vue';
import ChildrenTable from '@/components/admin/report/ChildrenTable.vue';
import ChildDetailDialog from '@/components/admin/report/ChildDetailDialog.vue';

const $q = useQuasar();
const store = useEvaluationStore();
// The admin layout shows a floating menu button whenever the drawer is closed (any screen width)
const { isDrawerOpen } = useAdminDrawer();

const skillNames = SKILL_DEFINITIONS.map((s) => s.label).join(', ');

const sheetUrl =
  'https://docs.google.com/spreadsheets/d/1OQ8X-6bmzj6DEsOMToPMNwE0AikWgqalzhTJXeZs57k/edit?pli=1&gid=0#gid=0';

const showChildModal = ref(false);
const selectedChild = ref<ChildSummary | null>(null);

const completionPercent = computed(() => {
  if (store.overallStats.totalChildren === 0) return 0;
  return Math.round(
    (store.overallStats.fullyCompletedChildren / store.overallStats.totalChildren) * 100,
  );
});

// Skills that actually have scores; empty when there is no data yet (shown as "-" instead of a fake skill)
const scoredSkills = computed(() =>
  SKILL_DEFINITIONS.map((skill) => ({
    label: skill.label,
    avg: store.overallStats.skillAverages[skill.key] || 0,
  })).filter((s) => s.avg > 0),
);

const topSkill = computed(() =>
  scoredSkills.value.length
    ? scoredSkills.value.reduce((best, s) => (s.avg > best.avg ? s : best))
    : null,
);

const lowestSkill = computed(() =>
  scoredSkills.value.length
    ? scoredSkills.value.reduce((low, s) => (s.avg < low.avg ? s : low))
    : null,
);

function scrollToChildren(): void {
  document.getElementById('children-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openChildDetail(child: ChildSummary): void {
  selectedChild.value = child;
  showChildModal.value = true;
}

function formatTime(isoString: string | null): string {
  if (!isoString) return '-';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
}

onMounted(async () => {
  // ดึงข้อมูลอัตโนมัติ 1 ครั้งทันทีเมื่อเปิดหน้าเว็บ หรือเมื่อผู้ใช้รีเฟรชหน้าเว็บ (F5)
  await store.fetchEvaluations();
});

onUnmounted(() => {
  store.stopAutoRefresh();
});
</script>

<style scoped>
.admin-report-page {
  background-color: #f8fafc;
  min-height: 100vh;
}
.header-wrap {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 16px;
}
/* Leave room for the admin layout's floating menu button (shown while the drawer is closed) */
.header-wrap--with-toggle > div:first-child {
  padding-left: 60px;
  min-height: 42px;
}
.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.3;
}
.header-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 12px;
  margin-top: 8px;
}
.meta-item {
  white-space: nowrap;
}
.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 999px;
  background: #e8f5e9;
  color: #006c0c;
  font-weight: 700;
  line-height: 20px;
}
.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #1c871e;
  animation: live-pulse 2s ease-in-out infinite;
}
@keyframes live-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}
.header-actions {
  display: flex;
  gap: 8px;
}
.action-pill :deep(.q-btn__content) {
  flex-wrap: nowrap;
  white-space: nowrap;
}
.insights-card {
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
}
@media (max-width: 599px) {
  .page-title {
    font-size: 1.25rem;
  }
  .header-actions > * {
    flex: 1 1 0;
  }
}
.border {
  border: 1px solid #e2e8f0;
}
.border-green {
  border: 1px solid #bbf7d0;
}
.border-red {
  border: 1px solid #fecaca;
}

.action-pill {
  border-radius: 8px;
  font-weight: 500;
}
.action-pill--primary {
  background: #006c0c !important;
  color: #ffffff !important;
}
</style>
