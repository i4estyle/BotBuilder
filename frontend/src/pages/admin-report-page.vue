<template>
  <q-page class="q-pa-lg admin-report-page">
    <!-- Institutional Header -->
    <div class="row items-center justify-between q-mb-lg header-wrap">
      <div>
        <div class="row items-center q-gutter-sm">
          <q-icon name="analytics" color="primary" size="28px" />
          <h1 class="text-h5 text-weight-bolder text-grey-10 q-my-none">
            รายงานและวิเคราะห์สมรรถนะผู้เรียน 7 ทักษะหลัก
          </h1>
          <!-- Live Heartbeat Pulse Indicator -->
          <div class="live-badge row items-center q-px-sm q-py-xs rounded-borders q-ml-sm">
            <span class="live-pulse-dot q-mr-xs"></span>
            <span class="text-caption text-weight-bold text-bb-green">เชื่อมต่อสด Google Sheets</span>
          </div>
        </div>
        <div class="text-caption text-grey-7 q-mt-xs">
          วิเคราะห์สมรรถนะ 7 ด้าน: สมาธิ, กล้ามเนื้อ, การสร้างหุ่นยนต์, การเขียนโปรแกรม, การแก้ปัญหา, ความคิดสร้างสรรค์, การนำเสนอ
          <span v-if="store.lastUpdated" class="q-ml-sm text-grey-8">
            · ปรับปรุงล่าสุด: {{ formatTime(store.lastUpdated) }}
          </span>
        </div>
      </div>

      <!-- Action Controls -->
      <div class="row items-center q-gutter-sm">
        <q-btn
          outline
          color="grey-8"
          icon="table_rows"
          label="ตารางบันทึกดิบ"
          to="/evaluations"
          class="action-pill"
        />

        <q-btn
          outline
          color="primary"
          icon="open_in_new"
          label="เปิด Google Sheet"
          :href="sheetUrl"
          target="_blank"
          class="action-pill"
        />
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
          <q-card flat bordered class="insights-card">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold text-grey-9 row items-center q-mb-xs">
                <q-icon name="insights" color="primary" size="20px" class="q-mr-xs" />
                บทวิเคราะห์และข้อเสนอแนะเชิงวิชาการ (Academic Insights)
              </div>
              <div class="text-caption text-grey-7 q-mb-md">
                สรุปจากฐานข้อมูลบันทึกการประเมินผลจริงทั้งหมด 875 รายการ
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
                      {{ topSkill.label }} ({{ topSkill.avg }} / 5.0)
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
                      {{ lowestSkill.label }} ({{ lowestSkill.avg }} / 5.0)
                    </div>
                    <div class="text-caption text-grey-8 q-mt-xs">
                      แนะนำให้จัดกิจกรรมเสริมเฉพาะกลุ่มเพื่อพัฒนาทักษะนี้ในบทเรียนถัดไป
                    </div>
                  </q-card>
                </div>

                <!-- 7 Topics Completed Milestone -->
                <div class="col-12 q-mt-sm">
                  <q-card flat bordered class="q-pa-md bg-white border">
                    <div class="row items-center justify-between">
                      <div>
                        <div class="text-caption text-bb-green text-weight-bold row items-center">
                          <q-icon name="verified" size="16px" class="q-mr-xs" />
                          เป้าหมายความสำเร็จหลักสูตร 7 บทเรียน
                        </div>
                        <div class="text-body2 text-grey-9 q-mt-xs">
                          มีผู้เรียนสำเร็จครบ 7 บทเรียนแล้ว <span class="text-weight-bold text-bb-green">{{ store.overallStats.fullyCompletedChildren }} คน</span>
                          จากทั้งหมด {{ store.overallStats.totalChildren }} คน (คิดเป็น {{ completionPercent }}% ของรุ่น)
                        </div>
                      </div>
                      <q-btn
                        flat
                        dense
                        color="primary"
                        label="ดูรายชื่อ"
                        icon="arrow_forward"
                        to="#children-table"
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
        <ChildrenTable
          :children="store.childrenSummaries"
          @select-child="openChildDetail"
        />
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
import { useEvaluationStore } from '@/stores/evaluation-store';
import { SKILL_DEFINITIONS, type ChildSummary } from '@/types/report';
import ReportOverviewCards from '@/components/admin/report/ReportOverviewCards.vue';
import OverallRadarChart from '@/components/admin/report/OverallRadarChart.vue';
import SkillBarChart from '@/components/admin/report/SkillBarChart.vue';
import CompletionDonutChart from '@/components/admin/report/CompletionDonutChart.vue';
import ChildrenTable from '@/components/admin/report/ChildrenTable.vue';
import ChildDetailDialog from '@/components/admin/report/ChildDetailDialog.vue';

const store = useEvaluationStore();

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

const topSkill = computed(() => {
  let highest = { label: 'สมาธิ', avg: 0 };
  SKILL_DEFINITIONS.forEach((skill) => {
    const avg = store.overallStats.skillAverages[skill.key] || 0;
    if (avg > highest.avg) {
      highest = { label: skill.label, avg };
    }
  });
  return highest;
});

const lowestSkill = computed(() => {
  let lowest = { label: 'กล้ามเนื้อ', avg: 999 };
  SKILL_DEFINITIONS.forEach((skill) => {
    const avg = store.overallStats.skillAverages[skill.key] || 0;
    if (avg > 0 && avg < lowest.avg) {
      lowest = { label: skill.label, avg };
    }
  });
  if (lowest.avg === 999) lowest.avg = 0;
  return lowest;
});

function openChildDetail(child: ChildSummary): void {
  selectedChild.value = child;
  showChildModal.value = true;
}

function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('th-TH');
  } catch {
    return isoString;
  }
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
.insights-card {
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  min-height: 380px;
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

.live-badge {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
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
