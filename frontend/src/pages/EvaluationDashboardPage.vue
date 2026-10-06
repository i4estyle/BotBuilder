<template>
  <q-page class="q-pa-md evaluation-dashboard-page">
    <!-- Header Section -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-weight-bold text-primary q-my-none">
          ระบบประเมินคะแนนเด็ก (Google Sheets Live Dashboard)
        </h1>
        <div class="text-caption text-grey-7 q-mt-xs">
          เชื่อมต่อข้อมูลสดจาก Google Sheets แผ่นงาน:
          <span class="text-weight-bold">{{ store.sheetTitle || 'Sheet1' }}</span>
          <span v-if="store.lastUpdated" class="q-ml-sm">
            (อัปเดตล่าสุด: {{ formatTime(store.lastUpdated) }})
          </span>
        </div>
      </div>

      <div class="row items-center q-gutter-sm">
        <q-btn
          outline
          color="primary"
          icon="open_in_new"
          label="เปิด Google Sheet"
          :href="sheetUrl"
          target="_blank"
        />
      </div>
    </div>

    <!-- Error Banner -->
    <q-banner v-if="store.errorMessage" class="bg-negative text-white q-mb-md rounded-borders">
      <template #avatar>
        <q-icon name="error_outline" size="md" />
      </template>
      <div class="text-subtitle2">เกิดข้อผิดพลาดในการโหลดข้อมูลจาก Google Sheets:</div>
      <div>{{ store.errorMessage }}</div>
      <template #action>
        <q-btn flat color="white" label="ลองใหม่อีกครั้ง" @click="() => store.fetchEvaluations()" />
      </template>
    </q-banner>

    <!-- KPI Summary Cards -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="metric-card bg-blue-1">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-8">รายการประเมินทั้งหมด</div>
              <div class="text-h4 text-weight-bolder text-blue-9">
                {{ store.totalCount.toLocaleString() }}
              </div>
            </div>
            <q-icon name="assignment" size="36px" color="blue-7" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="metric-card bg-green-1">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-8">ประเมินเสร็จสิ้น (Complete)</div>
              <div class="text-h4 text-weight-bolder text-positive">
                {{ store.completedCount.toLocaleString() }}
              </div>
            </div>
            <q-icon name="check_circle" size="36px" color="positive" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="metric-card bg-orange-1">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-8">รอดำเนินการ (Pending)</div>
              <div class="text-h4 text-weight-bolder text-warning">
                {{ store.pendingCount.toLocaleString() }}
              </div>
            </div>
            <q-icon name="schedule" size="36px" color="warning" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="metric-card bg-purple-1">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-8">คะแนนเฉลี่ยรวม</div>
              <div class="text-h4 text-weight-bolder text-purple-9">
                {{ store.overallAverageScore }} / 5.0
              </div>
            </div>
            <q-icon name="stars" size="36px" color="purple-7" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Controls Bar -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row items-center justify-between q-col-gutter-sm">
        <div class="col-12 col-md-5 row q-gutter-sm">
          <q-input
            v-model="searchQuery"
            dense
            outlined
            placeholder="ค้นหาชื่อผู้เรียน, บทเรียน, รหัสประเมิน..."
            class="col"
            clearable
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-select
            v-model="selectedStatus"
            dense
            outlined
            :options="statusFilterOptions"
            label="สถานะ"
            style="min-width: 140px"
            emit-value
            map-options
          />
        </div>

        <!-- Sync Status Info -->
        <div class="col-12 col-md-auto row items-center text-caption text-grey-7">
          <q-icon name="cloud_done" color="primary" size="18px" class="q-mr-xs" />
          <span>ซิงค์ล่าสุด: {{ formatTime(store.lastUpdated || '') }}</span>
        </div>
      </q-card-section>
    </q-card>

    <!-- Table Section -->
    <q-card flat bordered>
      <q-table
        :rows="filteredRecords"
        :columns="columns"
        row-key="evaluationId"
        :loading="store.isLoading"
        :pagination="pagination"
        flat
        separator="horizontal"
      >
        <!-- Custom ID Cell -->
        <template #body-cell-evaluationId="props">
          <q-td :props="props">
            <q-badge color="grey-3" text-color="black" class="q-pa-xs">
              {{ props.row.evaluationId }}
            </q-badge>
          </q-td>
        </template>

        <!-- Custom Status Cell -->
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip
              dense
              :color="props.row.status.toLowerCase() === 'complete' ? 'green-1' : 'orange-1'"
              :text-color="props.row.status.toLowerCase() === 'complete' ? 'green-9' : 'orange-9'"
              icon="circle"
              size="sm"
            >
              {{ props.row.status }}
            </q-chip>
          </q-td>
        </template>

        <!-- Custom Average Score Cell -->
        <template #body-cell-averageScore="props">
          <q-td :props="props">
            <div class="row items-center">
              <span class="text-weight-bold q-mr-xs">{{ props.row.averageScore }}</span>
              <span class="text-caption text-grey">/ 5</span>
              <q-badge
                v-if="props.row.totalScore > 0"
                color="primary"
                outline
                class="q-ml-sm"
              >
                รวม {{ props.row.totalScore }}
              </q-badge>
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
              color="blue"
              icon="folder"
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
          <q-td :props="props" align="right">
            <q-btn
              flat
              dense
              color="primary"
              label="ดูรายละเอียด"
              icon="visibility"
              @click="openDetails(props.row)"
            />
          </q-td>
        </template>

        <!-- Empty State -->
        <template #no-data>
          <div class="full-width row flex-center q-pa-lg text-grey">
            <q-icon name="inbox" size="48px" class="q-mr-sm" />
            <span>ไม่พบข้อมูลที่ตรงกับเงื่อนไข</span>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Detail Dialog Modal -->
    <q-dialog v-model="showDetailDialog">
      <q-card style="min-width: 650px; max-width: 90vw">
        <q-card-section class="row items-center justify-between bg-primary text-white">
          <div class="text-h6 text-weight-bold">
            รายละเอียดผลการประเมิน
          </div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedRecord" class="q-pa-md">
          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-subtitle1 text-weight-bold text-primary">
                {{ selectedRecord.evaluationTitle }}
              </div>
              <div class="text-caption text-grey-7">
                รหัส: {{ selectedRecord.evaluationId }} | คอร์ส: {{ selectedRecord.enrollment }}
              </div>
            </div>
            <q-chip
              :color="selectedRecord.status.toLowerCase() === 'complete' ? 'green-1' : 'orange-1'"
              :text-color="selectedRecord.status.toLowerCase() === 'complete' ? 'green-9' : 'orange-9'"
            >
              {{ selectedRecord.status }}
            </q-chip>
          </div>

          <q-separator class="q-mb-md" />

          <!-- Score Breakdown -->
          <div class="text-subtitle2 text-weight-bold q-mb-xs">คะแนนแต่ละทักษะ (1 - 5):</div>
          <div class="row q-col-gutter-sm q-mb-md">
            <div
              v-for="(skill, index) in skillLabels"
              :key="index"
              class="col-12 col-sm-6"
            >
              <q-card flat bordered class="q-pa-xs bg-grey-1">
                <div class="text-caption text-grey-8">{{ index + 1 }}. {{ skill.label }}</div>
                <div class="text-weight-bold text-primary">
                  {{ getScoreValue(selectedRecord.scores, skill.key) ?? '-' }} / 5
                </div>
              </q-card>
            </div>
          </div>

          <!-- Total & Average -->
          <div class="row items-center justify-between q-pa-sm bg-blue-1 rounded-borders q-mb-md">
            <div class="text-body2">
              คะแนนรวม: <span class="text-weight-bold">{{ selectedRecord.totalScore }} / 35</span>
            </div>
            <div class="text-body2">
              คะแนนเฉลี่ย: <span class="text-weight-bold text-primary">{{ selectedRecord.averageScore }} / 5.0</span>
            </div>
          </div>

          <!-- Comment / Evaluation Details -->
          <div v-if="selectedRecord.comment" class="q-mb-md">
            <div class="text-subtitle2 text-weight-bold q-mb-xs">ผลการประเมินและข้อคิดเห็น:</div>
            <q-card flat bordered class="q-pa-sm bg-grey-1 text-body2" style="white-space: pre-line">
              {{ selectedRecord.comment }}
            </q-card>
          </div>

          <!-- AI Message -->
          <div v-if="selectedRecord.aiMessage" class="q-mb-md">
            <div class="text-subtitle2 text-weight-bold q-mb-xs">ข้อความสรุปสำหรับผู้ปกครอง:</div>
            <q-card flat bordered class="q-pa-sm bg-amber-1 text-body2" style="white-space: pre-line">
              {{ selectedRecord.aiMessage }}
            </q-card>
          </div>

          <!-- Google Drive Link -->
          <div v-if="selectedRecord.googleDriveLink" class="q-mt-sm">
            <q-btn
              unelevated
              color="primary"
              icon="open_in_new"
              label="เปิดโฟลเดอร์ภาพใน Google Drive"
              :href="selectedRecord.googleDriveLink"
              target="_blank"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { useEvaluationStore } from '@/stores/evaluation-store';
import type { EvaluationRecord, EvaluationScores } from '@/types/evaluation';

const store = useEvaluationStore();

const sheetUrl =
  'https://docs.google.com/spreadsheets/d/1OQ8X-6bmzj6DEsOMToPMNwE0AikWgqalzhTJXeZs57k/edit?pli=1&gid=0#gid=0';

const searchQuery = ref('');
const selectedStatus = ref<string>('ALL');
const showDetailDialog = ref(false);
const selectedRecord = ref<EvaluationRecord | null>(null);

const statusFilterOptions = [
  { label: 'ทุกสถานะ', value: 'ALL' },
  { label: 'Complete (เสร็จสิ้น)', value: 'Complete' },
  { label: 'Pending (รอดำเนินการ)', value: 'Pending' },
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

function getScoreValue(scores: EvaluationScores, key: keyof EvaluationScores): number | null {
  return scores[key];
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
    align: 'center',
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
    label: 'จัดการ',
    align: 'right',
    field: () => '',
  },
];

const filteredRecords = computed(() => {
  let list = store.records;

  if (selectedStatus.value !== 'ALL') {
    list = list.filter(
      (r) => r.status.toLowerCase() === selectedStatus.value.toLowerCase(),
    );
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

function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('th-TH');
  } catch {
    return isoString;
  }
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
.metric-card {
  border-radius: 8px;
  transition: transform 0.2s ease;
}
.metric-card:hover {
  transform: translateY(-2px);
}
</style>

