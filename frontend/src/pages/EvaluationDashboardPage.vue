<template>
  <q-page class="q-pa-md q-pa-md-lg evaluation-dashboard-page">
    <!-- Header Section -->
    <div class="row items-start justify-between q-col-gutter-sm q-mb-lg">
      <div class="col-12 col-sm">
        <h1 class="text-h5 text-weight-bolder text-grey-10 q-my-none">การประเมินผลผู้เรียน</h1>
        <div class="row items-center q-gutter-x-sm text-caption text-grey-7 q-mt-xs">
          <span class="live-badge row items-center q-px-sm rounded-borders">
            <span class="live-dot q-mr-xs"></span>
            <span class="text-weight-bold text-bb-green">Google Sheets</span>
          </span>
          <span>
            แผ่นงาน
            <span class="text-weight-bold text-grey-9">{{ store.sheetTitle || 'Sheet1' }}</span>
          </span>
          <span>· อัปเดตล่าสุด {{ formatTime(store.lastUpdated) }}</span>
        </div>
      </div>

      <div class="col-12 col-sm-auto row items-center q-gutter-sm q-mt-xs q-mt-sm-none">
        <q-btn
          outline
          color="grey-8"
          icon="refresh"
          label="รีเฟรช"
          class="action-btn"
          :loading="store.isLoading"
          @click="() => store.fetchEvaluations()"
        />
        <q-btn
          outline
          color="primary"
          icon="open_in_new"
          label="เปิด Google Sheet"
          class="action-btn"
          :href="sheetUrl"
          target="_blank"
        />
      </div>
    </div>

    <!-- Error Banner -->
    <q-banner v-if="store.errorMessage" class="bg-red-1 text-red-10 q-mb-md rounded-borders">
      <template #avatar>
        <q-icon name="error_outline" size="md" color="negative" />
      </template>
      <div class="text-subtitle2 text-weight-bold">โหลดข้อมูลจาก Google Sheets ไม่สำเร็จ</div>
      <div class="text-body2">{{ store.errorMessage }}</div>
      <template #action>
        <q-btn
          flat
          color="negative"
          label="ลองใหม่อีกครั้ง"
          @click="() => store.fetchEvaluations()"
        />
      </template>
    </q-banner>

    <!-- KPI Summary Cards -->
    <div class="row q-col-gutter-md q-mb-md">
      <div v-for="card in kpiCards" :key="card.label" class="col-6 col-md-3">
        <q-card flat bordered class="kpi-card full-height" :class="`kpi-card--${card.tone}`">
          <q-card-section class="row items-center justify-between no-wrap kpi-section">
            <div class="kpi-text">
              <div class="text-caption text-weight-medium text-grey-8 ellipsis">
                {{ card.label }}
              </div>
              <div class="kpi-value text-weight-bolder text-grey-10 q-mt-xs">
                {{ card.value }}
                <span v-if="card.suffix" class="text-caption text-weight-regular text-grey-6">
                  {{ card.suffix }}
                </span>
              </div>
            </div>
            <div class="kpi-icon-wrap gt-xs" :class="card.iconClass">
              <q-icon :name="card.icon" size="26px" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Controls Bar -->
    <q-card flat bordered class="section-card q-mb-md">
      <q-card-section class="row items-center q-col-gutter-sm">
        <div class="col-12 col-sm">
          <q-input
            v-model="searchQuery"
            dense
            outlined
            placeholder="ค้นหาชื่อผู้เรียน, บทเรียน, รหัสประเมิน..."
            clearable
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-8 col-sm-auto">
          <q-select
            v-model="selectedStatus"
            dense
            outlined
            :options="statusFilterOptions"
            label="สถานะ"
            class="status-select"
            emit-value
            map-options
          />
        </div>
        <div class="col-4 col-sm-auto text-right text-caption text-grey-7">
          {{ filteredRecords.length.toLocaleString() }} รายการ
        </div>
      </q-card-section>
    </q-card>

    <!-- Table Section -->
    <q-card flat bordered class="section-card">
      <q-table
        :rows="filteredRecords"
        :columns="columns"
        row-key="evaluationId"
        :loading="store.isLoading"
        v-model:pagination="pagination"
        :grid="$q.screen.lt.sm"
        :visible-columns="visibleColumns"
        flat
        separator="horizontal"
        class="evaluation-table"
        rows-per-page-label="แสดงต่อหน้า"
        :pagination-label="paginationLabel"
      >
        <!-- Custom ID Cell -->
        <template #body-cell-evaluationId="props">
          <q-td :props="props">
            <span class="id-badge">{{ props.row.evaluationId }}</span>
          </q-td>
        </template>

        <!-- Custom Title Cell -->
        <template #body-cell-evaluationTitle="props">
          <q-td :props="props">
            <div class="text-weight-medium text-grey-10 title-cell">
              {{ props.row.evaluationTitle }}
            </div>
            <div v-if="props.row.enrollment" class="text-caption text-grey-6 title-cell">
              {{ props.row.enrollment }}
            </div>
          </q-td>
        </template>

        <!-- Custom Status Cell -->
        <template #body-cell-status="props">
          <q-td :props="props">
            <span class="status-pill" :class="statusClass(props.row.status)">
              {{ statusLabel(props.row.status) }}
            </span>
          </q-td>
        </template>

        <!-- Custom Average Score Cell -->
        <template #body-cell-averageScore="props">
          <q-td :props="props">
            <div class="score-cell">
              <div>
                <span
                  class="text-weight-bold"
                  :class="`text-${scoreColor(props.row.averageScore)}`"
                >
                  {{ formatScore(props.row.averageScore) }}
                </span>
                <span class="text-caption text-grey-6"> / 5</span>
              </div>
              <q-linear-progress
                :value="props.row.averageScore / 5"
                :color="scoreColor(props.row.averageScore)"
                track-color="grey-3"
                rounded
                size="4px"
              />
            </div>
          </q-td>
        </template>

        <!-- Custom Drive Link Cell -->
        <template #body-cell-googleDriveLink="props">
          <q-td :props="props">
            <q-btn
              v-if="props.row.googleDriveLink"
              flat
              round
              dense
              color="primary"
              icon="photo_library"
              :href="props.row.googleDriveLink"
              target="_blank"
            >
              <q-tooltip>เปิดโฟลเดอร์ภาพใน Google Drive</q-tooltip>
            </q-btn>
            <span v-else class="text-grey-5">-</span>
          </q-td>
        </template>

        <!-- Custom Actions Cell -->
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              dense
              no-caps
              color="primary"
              label="ดูรายละเอียด"
              icon-right="chevron_right"
              @click="openDetails(props.row)"
            />
          </q-td>
        </template>

        <!-- Mobile Card Item -->
        <template #item="props">
          <div class="col-12 q-pa-xs">
            <q-card
              flat
              bordered
              class="mobile-item cursor-pointer"
              @click="openDetails(props.row)"
            >
              <q-card-section class="q-pa-md">
                <div class="row items-start no-wrap q-mb-sm">
                  <div class="col">
                    <div class="text-weight-bold text-grey-10">
                      {{ props.row.evaluationTitle }}
                    </div>
                    <div class="text-caption text-grey-6">
                      <span class="id-badge q-mr-xs">{{ props.row.evaluationId }}</span>
                      <span v-if="props.row.sessionNumber"
                        >ครั้งที่ {{ props.row.sessionNumber }}</span
                      >
                      <span v-if="props.row.sessionDate"> · {{ props.row.sessionDate }}</span>
                    </div>
                  </div>
                  <span class="status-pill q-ml-sm" :class="statusClass(props.row.status)">
                    {{ statusLabel(props.row.status) }}
                  </span>
                </div>

                <div class="row items-center no-wrap q-gutter-x-sm">
                  <q-linear-progress
                    class="col"
                    :value="props.row.averageScore / 5"
                    :color="scoreColor(props.row.averageScore)"
                    track-color="grey-3"
                    rounded
                    size="6px"
                  />
                  <div class="text-body2 text-weight-bold">
                    {{ formatScore(props.row.averageScore) }}
                    <span class="text-caption text-grey-6">/ 5</span>
                  </div>
                  <q-btn
                    v-if="props.row.googleDriveLink"
                    flat
                    round
                    dense
                    size="sm"
                    color="primary"
                    icon="photo_library"
                    :href="props.row.googleDriveLink"
                    target="_blank"
                    @click.stop
                  />
                  <q-icon name="chevron_right" color="grey-5" size="20px" />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>

        <!-- Empty State -->
        <template #no-data>
          <div class="full-width column flex-center q-pa-xl text-grey-6">
            <q-icon name="inbox" size="48px" class="q-mb-sm" />
            <span>ไม่พบข้อมูลที่ตรงกับเงื่อนไข</span>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Detail Dialog Modal -->
    <q-dialog
      v-model="showDetailDialog"
      :maximized="$q.screen.lt.sm"
      :transition-show="$q.screen.lt.sm ? 'slide-up' : 'scale'"
      :transition-hide="$q.screen.lt.sm ? 'slide-down' : 'scale'"
    >
      <q-card class="detail-card column no-wrap">
        <q-card-section class="row items-center no-wrap detail-header">
          <div class="col">
            <div class="text-overline text-grey-6 line-height-tight">รายละเอียดผลการประเมิน</div>
            <div
              v-if="selectedRecord"
              class="text-h6 text-weight-bold text-grey-10 ellipsis-2-lines"
            >
              {{ selectedRecord.evaluationTitle }}
            </div>
          </div>
          <q-btn flat round dense icon="close" color="grey-7" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section v-if="selectedRecord" class="col scroll q-pa-md">
          <!-- Meta Info -->
          <div class="row items-center q-gutter-sm q-mb-md">
            <span class="id-badge">{{ selectedRecord.evaluationId }}</span>
            <span class="status-pill" :class="statusClass(selectedRecord.status)">
              {{ statusLabel(selectedRecord.status) }}
            </span>
            <span v-if="selectedRecord.enrollment" class="text-caption text-grey-7">
              คอร์ส: {{ selectedRecord.enrollment }}
            </span>
            <span v-if="selectedRecord.sessionNumber" class="text-caption text-grey-7">
              · ครั้งที่ {{ selectedRecord.sessionNumber }}
            </span>
            <span v-if="selectedRecord.sessionDate" class="text-caption text-grey-7">
              · {{ selectedRecord.sessionDate }}
            </span>
          </div>

          <!-- Total & Average -->
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-6">
              <div class="summary-box">
                <div class="text-caption text-grey-7">คะแนนรวม</div>
                <div class="text-h6 text-weight-bolder text-grey-10">
                  {{ selectedRecord.totalScore }}
                  <span class="text-caption text-grey-6">/ 35</span>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="summary-box">
                <div class="text-caption text-grey-7">คะแนนเฉลี่ย</div>
                <div
                  class="text-h6 text-weight-bolder"
                  :class="`text-${scoreColor(selectedRecord.averageScore)}`"
                >
                  {{ formatScore(selectedRecord.averageScore) }}
                  <span class="text-caption text-grey-6">/ 5.0</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Score Breakdown -->
          <div class="text-subtitle2 text-weight-bold text-grey-10 q-mb-sm">คะแนนแต่ละทักษะ</div>
          <div class="skill-list q-mb-md">
            <div v-for="(skill, index) in skillLabels" :key="skill.key" class="skill-row">
              <div class="row items-center justify-between no-wrap q-mb-xs">
                <div class="text-body2 text-grey-9 ellipsis">
                  <span class="text-grey-6 q-mr-xs">{{ index + 1 }}.</span>{{ skill.label }}
                </div>
                <div class="text-body2 text-weight-bold q-ml-sm no-wrap">
                  <template v-if="getScoreValue(selectedRecord.scores, skill.key) !== null">
                    {{ getScoreValue(selectedRecord.scores, skill.key) }}
                    <span class="text-caption text-grey-6">/ 5</span>
                  </template>
                  <span v-else class="text-grey-5">-</span>
                </div>
              </div>
              <q-linear-progress
                :value="(getScoreValue(selectedRecord.scores, skill.key) ?? 0) / 5"
                :color="scoreColor(getScoreValue(selectedRecord.scores, skill.key) ?? 0)"
                track-color="grey-3"
                rounded
                size="8px"
              />
            </div>
          </div>

          <!-- Comment / Evaluation Details -->
          <div v-if="selectedRecord.comment" class="q-mb-md">
            <div class="text-subtitle2 text-weight-bold text-grey-10 q-mb-xs">
              ผลการประเมินและข้อคิดเห็น
            </div>
            <div class="text-box">{{ selectedRecord.comment }}</div>
          </div>

          <!-- AI Message -->
          <div v-if="selectedRecord.aiMessage" class="q-mb-md">
            <div class="text-subtitle2 text-weight-bold text-grey-10 q-mb-xs">
              ข้อความสรุปสำหรับผู้ปกครอง
            </div>
            <div class="text-box text-box--highlight">{{ selectedRecord.aiMessage }}</div>
          </div>
        </q-card-section>

        <template v-if="selectedRecord?.googleDriveLink">
          <q-separator />
          <q-card-actions align="right" class="q-pa-md">
            <q-btn
              unelevated
              no-caps
              color="primary"
              icon="photo_library"
              label="เปิดโฟลเดอร์ภาพใน Google Drive"
              class="action-btn"
              :href="selectedRecord.googleDriveLink"
              target="_blank"
            />
          </q-card-actions>
        </template>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import type { QTableColumn } from 'quasar';
import { useEvaluationStore } from '@/stores/evaluation-store';
import type { EvaluationRecord, EvaluationScores } from '@/types/evaluation';

const $q = useQuasar();
const store = useEvaluationStore();

const sheetUrl =
  'https://docs.google.com/spreadsheets/d/1OQ8X-6bmzj6DEsOMToPMNwE0AikWgqalzhTJXeZs57k/edit?pli=1&gid=0#gid=0';

const searchQuery = ref('');
const selectedStatus = ref<string>('ALL');
const showDetailDialog = ref(false);
const selectedRecord = ref<EvaluationRecord | null>(null);

const statusFilterOptions = [
  { label: 'ทุกสถานะ', value: 'ALL' },
  { label: 'เสร็จสิ้น', value: 'Complete' },
  { label: 'รอดำเนินการ', value: 'Pending' },
];

const pagination = ref({
  rowsPerPage: 15,
});

const skillLabels: { key: keyof EvaluationScores; label: string }[] = [
  { key: 'score1', label: 'ความสามารถทางเทคนิค' },
  { key: 'score2', label: 'การออกแบบและความคิดสร้างสรรค์' },
  { key: 'score3', label: 'การคิดเชิงระบบ' },
  { key: 'score4', label: 'การแก้ปัญหา' },
  { key: 'score5', label: 'ความร่วมมือและความเป็นผู้นำ' },
  { key: 'score6', label: 'ความยืดหยุ่นและทัศนคติเชิงเติบโต' },
  { key: 'score7', label: 'การนำเสนอและการสื่อสาร' },
];

const kpiCards = computed(() => [
  {
    label: 'รายการประเมินทั้งหมด',
    value: store.totalCount.toLocaleString(),
    suffix: 'รายการ',
    icon: 'assignment',
    tone: 'primary',
    iconClass: 'bg-green-1 text-bb-green',
  },
  {
    label: 'ประเมินเสร็จสิ้น',
    value: store.completedCount.toLocaleString(),
    suffix: 'รายการ',
    icon: 'task_alt',
    tone: 'success',
    iconClass: 'bg-green-2 text-bb-green',
  },
  {
    label: 'รอดำเนินการ',
    value: store.pendingCount.toLocaleString(),
    suffix: 'รายการ',
    icon: 'schedule',
    tone: 'warning',
    iconClass: 'bg-amber-1 text-amber-9',
  },
  {
    label: 'คะแนนเฉลี่ยรวม',
    value: formatScore(store.overallAverageScore),
    suffix: '/ 5.0',
    icon: 'stars',
    tone: 'accent',
    iconClass: 'bg-red-1 text-bb-red',
  },
]);

function getScoreValue(scores: EvaluationScores, key: keyof EvaluationScores): number | null {
  return scores[key];
}

function isComplete(status: string): boolean {
  return status.toLowerCase() === 'complete';
}

function statusLabel(status: string): string {
  if (isComplete(status)) return 'เสร็จสิ้น';
  if (status.toLowerCase() === 'pending') return 'รอดำเนินการ';
  return status || '-';
}

function statusClass(status: string): string {
  return isComplete(status) ? 'status-pill--complete' : 'status-pill--pending';
}

function scoreColor(score: number): string {
  if (score >= 4) return 'positive';
  if (score >= 3) return 'light-green-7';
  if (score >= 2) return 'amber-8';
  if (score > 0) return 'deep-orange-7';
  return 'grey-5';
}

function formatScore(score: number): string {
  return Number.isFinite(score) ? score.toFixed(2).replace(/\.?0+$/, '') || '0' : '-';
}

const columns: QTableColumn<EvaluationRecord>[] = [
  {
    name: 'evaluationId',
    required: true,
    label: 'รหัสประเมิน',
    align: 'left',
    field: (row) => row.evaluationId,
    sortable: true,
  },
  {
    name: 'evaluationTitle',
    label: 'ชื่อการประเมิน / ผู้เรียน',
    align: 'left',
    field: (row) => row.evaluationTitle,
    sortable: true,
  },
  {
    name: 'sessionNumber',
    label: 'ครั้งที่',
    align: 'center',
    field: (row) => row.sessionNumber ?? '-',
    sortable: true,
  },
  {
    name: 'sessionDate',
    label: 'วันที่',
    align: 'center',
    field: (row) => row.sessionDate,
    sortable: true,
  },
  {
    name: 'averageScore',
    label: 'คะแนนเฉลี่ย',
    align: 'left',
    field: (row) => row.averageScore,
    sortable: true,
  },
  {
    name: 'status',
    label: 'สถานะ',
    align: 'center',
    field: (row) => row.status,
    sortable: true,
  },
  {
    name: 'googleDriveLink',
    label: 'รูปภาพ',
    align: 'center',
    field: (row) => row.googleDriveLink,
  },
  {
    name: 'actions',
    label: '',
    align: 'right',
    field: () => '',
  },
];

// Hide secondary columns on tablet widths so the table fits without horizontal scroll
const visibleColumns = computed(() => {
  const all = columns.map((c) => c.name);
  if ($q.screen.lt.md) {
    return all.filter((n) => n !== 'sessionDate' && n !== 'googleDriveLink');
  }
  return all;
});

function paginationLabel(start: number, end: number, total: number): string {
  return `${start}-${end} จาก ${total}`;
}

const filteredRecords = computed(() => {
  let list = store.records;

  if (selectedStatus.value !== 'ALL') {
    list = list.filter((r) => r.status.toLowerCase() === selectedStatus.value.toLowerCase());
  }

  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(
      (r) =>
        r.evaluationId.toLowerCase().includes(q) ||
        r.evaluationTitle.toLowerCase().includes(q) ||
        r.enrollment.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q),
    );
  }

  return list;
});

function formatTime(isoString: string | null): string {
  if (!isoString) return '-';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
}

function openDetails(record: EvaluationRecord): void {
  selectedRecord.value = record;
  showDetailDialog.value = true;
}

onMounted(async () => {
  await store.fetchEvaluations();
});

onUnmounted(() => {
  store.stopAutoRefresh();
});
</script>

<style scoped>
/* KPI cards — matches admin report page */
.kpi-card {
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease-in-out;
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.06);
}
.kpi-card--primary {
  border-top: 3px solid #006c0c;
}
.kpi-card--success {
  border-top: 3px solid #1c871e;
}
.kpi-card--warning {
  border-top: 3px solid #f59e0b;
}
.kpi-card--accent {
  border-top: 3px solid #bc0100;
}
.kpi-text {
  min-width: 0;
}
.kpi-value {
  font-size: 1.75rem;
  line-height: 1.2;
}
.kpi-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-card {
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}
.action-btn {
  border-radius: 8px;
}
.status-select {
  min-width: 150px;
}

/* Live badge */
.live-badge {
  background: #e8f5e9;
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

/* Table */
.evaluation-table :deep(thead th) {
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
}
.evaluation-table :deep(tbody tr:hover) {
  background: #f8fafc;
}
.title-cell {
  max-width: 320px;
  white-space: normal;
  word-break: break-word;
}
.score-cell {
  min-width: 90px;
  max-width: 120px;
}

.id-badge {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 6px;
  background: #f1f5f9;
  color: #334155;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.status-pill::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.status-pill--complete {
  background: #e8f5e9;
  color: #1b5e20;
}
.status-pill--pending {
  background: #fff8e1;
  color: #b45309;
}

/* Mobile list */
.mobile-item {
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}
.mobile-item:active {
  background: #f8fafc;
}

/* Detail dialog */
.detail-card {
  width: 680px;
  max-width: 100%;
  max-height: 90vh;
  border-radius: 12px;
}
.line-height-tight {
  line-height: 1.4;
}
.summary-box {
  padding: 10px 14px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}
.skill-list {
  display: grid;
  gap: 12px;
}
.text-box {
  padding: 10px 14px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  white-space: pre-line;
  font-size: 14px;
  color: #334155;
}
.text-box--highlight {
  background: #fffbeb;
  border-color: #fde68a;
}

@media (max-width: 599px) {
  .kpi-value {
    font-size: 1.4rem;
  }
  .detail-card {
    width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
}
</style>
