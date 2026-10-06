<template>
  <q-card flat bordered class="children-table-card">
    <q-card-section class="row items-center justify-between q-col-gutter-sm border-bottom">
      <div>
        <div class="text-subtitle1 text-weight-bold text-grey-9 row items-center">
          <q-icon name="assignment_ind" color="primary" class="q-mr-xs" size="20px" />
          ทะเบียนประเมินสมรรถนะรายบุคคล (Student Assessment Registry)
        </div>
        <div class="text-caption text-grey-7">
          ตรวจสอบความก้าวหน้ารายบุคคลครบ 7 บทเรียน พร้อมเปิดดูแผนภูมิใยแมงมุมสมรรถนะ
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="row items-center q-gutter-sm">
        <q-btn-toggle
          v-model="completionFilter"
          dense
          rounded
          toggle-color="primary"
          color="grey-2"
          text-color="grey-8"
          :options="[
            { label: 'ทั้งหมด (' + children.length + ')', value: 'ALL' },
            { label: 'ครบ 7 ครั้ง (' + completedCount + ')', value: 'COMPLETED' },
            { label: 'กำลังเรียน (' + inProgressCount + ')', value: 'IN_PROGRESS' },
          ]"
        />

        <q-input
          v-model="searchQuery"
          dense
          outlined
          placeholder="ค้นหาชื่อผู้เรียน, คอร์ส..."
          style="min-width: 240px"
          clearable
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </q-card-section>

    <!-- QTable -->
    <q-table
      :rows="filteredChildren"
      :columns="columns"
      row-key="enrollment"
      :pagination="pagination"
      flat
      separator="horizontal"
      class="children-table"
    >
      <!-- Student Name & Enrollment -->
      <template #body-cell-studentName="props">
        <q-td :props="props">
          <div class="cursor-pointer" @click="emit('selectChild', props.row)">
            <div class="text-weight-bold text-bb-green hover-underline">
              {{ props.row.studentName }}
            </div>
            <div class="text-caption text-grey-6 ellipsis" style="max-width: 240px">
              {{ props.row.enrollment }}
            </div>
          </div>
        </q-td>
      </template>

      <!-- Course Level -->
      <template #body-cell-courseTitle="props">
        <q-td :props="props">
          <q-badge color="grey-2" text-color="grey-9" class="q-pa-xs border">
            {{ props.row.courseTitle || '-' }}
          </q-badge>
        </q-td>
      </template>

      <!-- 7 Sessions Progress Step Dots -->
      <template #body-cell-completion="props">
        <q-td :props="props">
          <div class="row items-center q-gutter-xs no-wrap">
            <span
              v-for="s in 7"
              :key="s"
              class="session-step-dot"
              :class="{
                'session-step-dot--done': hasCompletedSession(props.row, s),
                'session-step-dot--pending': !hasCompletedSession(props.row, s),
              }"
            >
              <q-tooltip>บทเรียนที่ {{ s }}: {{ hasCompletedSession(props.row, s) ? 'ประเมินแล้ว' : 'ยังไม่ประเมิน' }}</q-tooltip>
            </span>
            <span class="text-caption text-weight-bold q-ml-sm" :class="props.row.isCompleted7 ? 'text-bb-green' : 'text-grey-7'">
              {{ props.row.completedSessions }}/7
            </span>
          </div>
        </q-td>
      </template>

      <!-- Status Badge -->
      <template #body-cell-status="props">
        <q-td :props="props" align="center">
          <q-chip
            dense
            size="sm"
            :color="props.row.isCompleted7 ? 'green-1' : 'orange-1'"
            :text-color="props.row.isCompleted7 ? 'green-9' : 'orange-9'"
          >
            <q-icon :name="props.row.isCompleted7 ? 'check' : 'schedule'" size="14px" class="q-mr-xs" />
            {{ props.row.isCompleted7 ? 'ครบ 7 บทเรียน' : 'กำลังเรียน' }}
          </q-chip>
        </q-td>
      </template>

      <!-- Overall Average -->
      <template #body-cell-overallAverage="props">
        <q-td :props="props" align="center">
          <div class="text-weight-bold text-bb-green text-subtitle2">
            {{ props.row.overallAverage }}
            <span class="text-caption text-grey-6 text-weight-regular">/ 5.0</span>
          </div>
        </q-td>
      </template>

      <!-- Actions -->
      <template #body-cell-actions="props">
        <q-td :props="props" align="right">
          <q-btn
            unelevated
            dense
            size="sm"
            color="primary"
            icon="radar"
            label="ดูกราฟใยแมงมุม"
            class="q-px-sm action-btn"
            @click="emit('selectChild', props.row)"
          />
        </q-td>
      </template>

      <!-- Empty State -->
      <template #no-data>
        <div class="full-width row flex-center q-pa-xl text-grey-6">
          <q-icon name="search_off" size="40px" class="q-mr-sm" />
          <span>ไม่พบข้อมูลผู้เรียนที่ตรงกับเงื่อนไขการค้นหา</span>
        </div>
      </template>
    </q-table>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { QTableColumn } from 'quasar';
import type { ChildSummary } from '@/types/report';

const props = defineProps<{
  children: ChildSummary[];
}>();

const emit = defineEmits<{
  (e: 'selectChild', child: ChildSummary): void;
}>();

const searchQuery = ref('');
const completionFilter = ref<'ALL' | 'COMPLETED' | 'IN_PROGRESS'>('ALL');

const pagination = ref({
  rowsPerPage: 15,
});

const completedCount = computed(() => {
  return props.children.filter((c) => c.isCompleted7).length;
});

const inProgressCount = computed(() => {
  return props.children.filter((c) => !c.isCompleted7).length;
});

function hasCompletedSession(child: ChildSummary, sessionNum: number): boolean {
  return child.records.some(
    (r) => r.sessionNumber === sessionNum && r.status.toLowerCase() === 'complete',
  );
}

const columns: QTableColumn<ChildSummary>[] = [
  {
    name: 'studentName',
    required: true,
    label: 'ผู้เรียน / รหัส',
    align: 'left',
    field: (row) => row.studentName,
    sortable: true,
  },
  {
    name: 'courseTitle',
    label: 'หลักสูตร / ระดับ',
    align: 'left',
    field: (row) => row.courseTitle,
    sortable: true,
  },
  {
    name: 'completion',
    label: 'ความก้าวหน้า (7 Sessions)',
    align: 'left',
    field: (row) => row.completedSessions,
    sortable: true,
  },
  {
    name: 'status',
    label: 'สถานะ',
    align: 'center',
    field: (row) => (row.isCompleted7 ? 'ครบ' : 'กำลังเรียน'),
    sortable: true,
  },
  {
    name: 'overallAverage',
    label: 'คะแนนเฉลี่ย',
    align: 'center',
    field: (row) => row.overallAverage,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'แผนภูมิสมรรถนะ',
    align: 'right',
    field: () => '',
  },
];

const filteredChildren = computed(() => {
  let list = props.children;

  if (completionFilter.value === 'COMPLETED') {
    list = list.filter((c) => c.isCompleted7);
  } else if (completionFilter.value === 'IN_PROGRESS') {
    list = list.filter((c) => !c.isCompleted7);
  }

  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.studentName.toLowerCase().includes(q) ||
        c.enrollment.toLowerCase().includes(q) ||
        c.courseTitle.toLowerCase().includes(q),
    );
  }

  return list;
});
</script>

<style scoped>
.children-table-card {
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
}
.border-bottom {
  border-bottom: 1px solid #e2e8f0;
}
.border {
  border: 1px solid #e2e8f0;
}
.hover-underline:hover {
  text-decoration: underline;
}

/* 7 Session Step Dots */
.session-step-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  transition: all 0.2s ease;
}
.session-step-dot--done {
  background-color: #006c0c;
  box-shadow: 0 0 4px rgba(0, 108, 12, 0.4);
}
.session-step-dot--pending {
  background-color: #e2e8f0;
  border: 1px solid #cbd5e1;
}

.action-btn {
  background: #006c0c !important;
  color: #ffffff;
  border-radius: 6px;
  font-weight: 500;
  transition: opacity 0.2s;
}
.action-btn:hover {
  opacity: 0.9;
}
</style>
