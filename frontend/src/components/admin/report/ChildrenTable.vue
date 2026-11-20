<template>
  <q-card flat bordered class="children-table-card">
    <q-card-section class="border-bottom">
      <div class="row items-start justify-between q-col-gutter-sm">
        <div class="col-12 col-lg">
          <div class="text-subtitle1 text-weight-bold text-grey-9 row items-center no-wrap">
            <q-icon name="assignment_ind" color="primary" class="q-mr-xs" size="20px" />
            ทะเบียนประเมินสมรรถนะรายบุคคล
          </div>
          <div class="text-caption text-grey-7">
            ตรวจสอบความก้าวหน้ารายบุคคลครบ 7 บทเรียน พร้อมเปิดดูแผนภูมิใยแมงมุมสมรรถนะ
          </div>
        </div>

        <!-- Filters & Search -->
        <div class="col-12 col-lg-auto">
          <div class="table-controls">
            <q-btn-toggle
              v-model="completionFilter"
              dense
              rounded
              no-caps
              unelevated
              toggle-color="primary"
              color="grey-2"
              text-color="grey-8"
              class="filter-toggle"
              :options="[
                { label: `ทั้งหมด (${children.length})`, value: 'ALL' },
                { label: `ครบ 7 ครั้ง (${completedCount})`, value: 'COMPLETED' },
                { label: `กำลังเรียน (${inProgressCount})`, value: 'IN_PROGRESS' },
              ]"
            />

            <q-input
              v-model="searchQuery"
              dense
              outlined
              placeholder="ค้นหาชื่อผู้เรียน, คอร์ส..."
              class="search-input"
              clearable
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <div class="sort-control">
              <q-select
                v-model="sortField"
                dense
                outlined
                emit-value
                map-options
                options-dense
                label="เรียงตาม"
                :options="sortFieldOptions"
                class="sort-select"
              >
                <template #option="scope">
                  <q-item-label v-if="scope.opt.header" header class="q-py-xs text-caption">
                    {{ scope.opt.header }}
                  </q-item-label>
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar class="sort-option-icon">
                      <q-icon
                        :name="scope.opt.icon"
                        :style="{ color: scope.opt.color }"
                        size="18px"
                      />
                    </q-item-section>
                    <q-item-section>{{ scope.opt.label }}</q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-btn
                outline
                dense
                no-caps
                color="grey-8"
                class="sort-direction"
                :icon="sortDescending ? 'arrow_downward' : 'arrow_upward'"
                :label="directionLabel"
                :aria-label="`ลำดับ: ${directionLabel}`"
                @click="sortDescending = !sortDescending"
              />
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- QTable -->
    <q-table
      v-model:pagination="pagination"
      :rows="filteredChildren"
      :columns="columns"
      :visible-columns="visibleColumns"
      :grid="$q.screen.lt.sm"
      row-key="enrollment"
      flat
      separator="horizontal"
      class="children-table"
      rows-per-page-label="แสดงต่อหน้า"
      :pagination-label="(start, end, total) => `${start}-${end} จาก ${total}`"
      @row-click="(_evt, row) => emit('selectChild', row)"
    >
      <!-- Student Name & Course -->
      <template #body-cell-studentName="props">
        <q-td :props="props">
          <div class="text-weight-bold text-bb-green">
            {{ props.row.studentName }}
          </div>
          <div
            v-if="props.row.courseTitle && $q.screen.lt.lg"
            class="text-caption text-grey-6 ellipsis name-sub"
          >
            {{ props.row.courseTitle }}
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
          <div class="row items-center no-wrap">
            <div class="session-dots">
              <span
                v-for="s in 7"
                :key="s"
                class="session-step-dot"
                :class="
                  hasCompletedSession(props.row, s)
                    ? 'session-step-dot--done'
                    : 'session-step-dot--pending'
                "
              >
                <q-tooltip
                  >บทเรียนที่ {{ s }}:
                  {{
                    hasCompletedSession(props.row, s) ? 'ประเมินแล้ว' : 'ยังไม่ประเมิน'
                  }}</q-tooltip
                >
              </span>
            </div>
            <span
              class="text-caption text-weight-bold q-ml-sm"
              :class="props.row.isCompleted7 ? 'text-bb-green' : 'text-grey-7'"
            >
              {{ Math.min(props.row.completedSessions, 7) }}/7
            </span>
          </div>
          <div class="text-caption text-grey-6">
            ประเมินล่าสุด {{ formatLatest(latestDateOf(props.row)) }}
          </div>
        </q-td>
      </template>

      <!-- Status Badge -->
      <template #body-cell-status="props">
        <q-td :props="props">
          <span class="status-pill" :class="statusClass(props.row)">
            {{ statusLabel(props.row) }}
          </span>
        </q-td>
      </template>

      <!-- Overall Average -->
      <template #body-cell-overallAverage="props">
        <q-td :props="props">
          <div v-if="displayScore(props.row) > 0" class="text-weight-bold text-bb-green no-wrap">
            {{ displayScore(props.row) }}
            <span class="text-caption text-grey-6 text-weight-regular">/ 5.0</span>
          </div>
          <span v-else class="text-caption text-grey-5 no-wrap">ยังไม่มีคะแนน</span>
        </q-td>
      </template>

      <!-- Actions -->
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            unelevated
            dense
            no-caps
            size="sm"
            icon="radar"
            :label="showActionLabel ? 'ดูกราฟใยแมงมุม' : undefined"
            :round="!showActionLabel"
            class="action-btn"
            :class="{ 'q-px-sm': showActionLabel }"
            aria-label="ดูกราฟใยแมงมุม"
            @click.stop="emit('selectChild', props.row)"
          >
            <q-tooltip v-if="!showActionLabel">ดูกราฟใยแมงมุม</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <!-- Mobile Card Item -->
      <template #item="props">
        <div class="col-12 q-pa-xs">
          <div class="mobile-item cursor-pointer" @click="emit('selectChild', props.row)">
            <div class="row items-start no-wrap q-mb-sm">
              <div class="col" style="min-width: 0">
                <div class="text-weight-bold text-bb-green">{{ props.row.studentName }}</div>
                <div v-if="props.row.courseTitle" class="text-caption text-grey-6">
                  {{ props.row.courseTitle }}
                </div>
              </div>
              <span class="status-pill q-ml-sm" :class="statusClass(props.row)">
                {{ statusLabel(props.row) }}
              </span>
            </div>
            <div class="row items-center no-wrap q-gutter-x-sm">
              <div class="session-dots">
                <span
                  v-for="s in 7"
                  :key="s"
                  class="session-step-dot"
                  :class="
                    hasCompletedSession(props.row, s)
                      ? 'session-step-dot--done'
                      : 'session-step-dot--pending'
                  "
                ></span>
              </div>
              <span class="text-caption text-weight-bold text-grey-7">
                {{ Math.min(props.row.completedSessions, 7) }}/7
              </span>
              <div class="col text-right text-body2 text-weight-bold text-bb-green no-wrap">
                <span
                  v-if="selectedSkill"
                  class="text-caption text-grey-7 text-weight-regular q-mr-xs"
                  >{{ selectedSkill.shortLabel }}</span
                >
                <template v-if="displayScore(props.row) > 0">
                  {{ displayScore(props.row) }}
                  <span class="text-caption text-grey-6 text-weight-regular">/ 5.0</span>
                </template>
                <span v-else class="text-caption text-grey-5 text-weight-regular"
                  >ยังไม่มีคะแนน</span
                >
              </div>
              <q-icon name="chevron_right" color="grey-5" size="20px" />
            </div>
            <div class="text-caption text-grey-6 q-mt-xs">
              ประเมินล่าสุด {{ formatLatest(latestDateOf(props.row)) }}
            </div>
          </div>
        </div>
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
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import type { QTableColumn } from 'quasar';
import { SKILL_DEFINITIONS, type ChildSummary, type SkillMeta } from '@/types/report';
import { sheetDateValue } from '@/utils/sheet-date';

const props = defineProps<{
  children: ChildSummary[];
}>();

const emit = defineEmits<{
  (e: 'selectChild', child: ChildSummary): void;
}>();

const $q = useQuasar();

const searchQuery = ref('');
const completionFilter = ref<'ALL' | 'COMPLETED' | 'IN_PROGRESS'>('ALL');

const pagination = ref<{
  page: number;
  rowsPerPage: number;
  sortBy: string | null;
  descending: boolean;
}>({
  page: 1,
  rowsPerPage: 15,
  sortBy: null,
  descending: false,
});

/* ---------- sort-by menu (works on mobile cards too, where there are no column headers) ---------- */
type SkillKey = SkillMeta['key'];
type SortField = 'latest' | 'average' | 'progress' | 'name' | `skill:${SkillKey}`;

const sortField = ref<SortField>('latest');
const sortDescending = ref(true);

interface SortFieldOption {
  label: string;
  value: SortField;
  icon: string;
  color?: string;
  header?: string;
}
const sortFieldOptions: SortFieldOption[] = [
  { label: 'ประเมินล่าสุด', value: 'latest', icon: 'event' },
  { label: 'คะแนนเฉลี่ยรวม', value: 'average', icon: 'grade' },
  { label: 'ความก้าวหน้า', value: 'progress', icon: 'donut_large' },
  { label: 'ชื่อผู้เรียน', value: 'name', icon: 'sort_by_alpha' },
  ...SKILL_DEFINITIONS.map((skill, index) => ({
    label: skill.label,
    value: `skill:${skill.key}` as SortField,
    icon: skill.icon,
    color: skill.color,
    ...(index === 0 ? { header: 'คะแนนรายทักษะ' } : {}),
  })),
];

const selectedSkill = computed(() =>
  sortField.value.startsWith('skill:')
    ? (SKILL_DEFINITIONS.find((s) => `skill:${s.key}` === sortField.value) ?? null)
    : null,
);

const directionLabel = computed(() => {
  if (sortField.value === 'name') return sortDescending.value ? 'ฮ → ก' : 'ก → ฮ';
  if (sortField.value === 'latest') return sortDescending.value ? 'ใหม่ → เก่า' : 'เก่า → ใหม่';
  return sortDescending.value ? 'มาก → น้อย' : 'น้อย → มาก';
});

// Each field starts in its most useful direction: A→Z for names, highest/newest first otherwise
watch(sortField, (field) => {
  sortDescending.value = field !== 'name';
});

// Picking from the menu clears any column-header sort so the menu takes effect
watch([sortField, sortDescending], () => {
  pagination.value = { ...pagination.value, page: 1, sortBy: null, descending: false };
});

// New search/filter results should start from the first page
watch([searchQuery, completionFilter], () => {
  pagination.value = { ...pagination.value, page: 1 };
});

const latestDateCache = new WeakMap<ChildSummary, number>();
function latestDateOf(child: ChildSummary): number {
  let value = latestDateCache.get(child);
  if (value === undefined) {
    value = child.records.reduce(
      (max, r) => Math.max(max, sheetDateValue(r.sessionDate)),
      Number.NEGATIVE_INFINITY,
    );
    latestDateCache.set(child, value);
  }
  return value;
}

function formatLatest(value: number): string {
  if (!Number.isFinite(value)) return '-';
  return new Date(value).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
    timeZone: 'UTC',
  });
}

/** The score shown in the score column: the selected skill when sorting by one, else the overall average. */
function displayScore(child: ChildSummary): number {
  return selectedSkill.value
    ? child.skillAverages[selectedSkill.value.key] || 0
    : child.overallAverage;
}

/** Value to sort on; null means "no data", which always sorts last regardless of direction. */
function sortValue(child: ChildSummary): number | string | null {
  switch (sortField.value) {
    case 'latest': {
      const value = latestDateOf(child);
      return Number.isFinite(value) ? value : null;
    }
    case 'average':
      return child.overallAverage > 0 ? child.overallAverage : null;
    case 'progress':
      return child.completedSessions;
    case 'name':
      return child.studentName;
    default:
      return displayScore(child) > 0 ? displayScore(child) : null;
  }
}

const thaiCollator = new Intl.Collator('th');
function sortChildren(list: ChildSummary[]): ChildSummary[] {
  const direction = sortDescending.value ? -1 : 1;
  return [...list].sort((a, b) => {
    const va = sortValue(a);
    const vb = sortValue(b);
    if (va === null || vb === null) {
      if (va !== vb) return va === null ? 1 : -1;
    } else {
      const diff =
        typeof va === 'string' || typeof vb === 'string'
          ? thaiCollator.compare(String(va), String(vb))
          : va - vb;
      if (diff !== 0) return diff * direction;
    }
    return thaiCollator.compare(a.studentName, b.studentName);
  });
}

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

function statusLabel(child: ChildSummary): string {
  return child.isCompleted7 ? 'ครบ 7 บทเรียน' : 'กำลังเรียน';
}

function statusClass(child: ChildSummary): string {
  return child.isCompleted7 ? 'status-pill--complete' : 'status-pill--pending';
}

// The text label only fits on wide screens; elsewhere the action is an icon with a tooltip
const showActionLabel = computed(() => $q.screen.width >= 1600);

const columns = computed<QTableColumn<ChildSummary>[]>(() => [
  {
    name: 'studentName',
    required: true,
    label: 'ผู้เรียน',
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
    label: 'ความก้าวหน้า (7 ครั้ง)',
    align: 'left',
    field: (row) => row.completedSessions,
    sortable: true,
  },
  {
    name: 'status',
    label: 'สถานะ',
    align: 'center',
    field: (row) => (row.isCompleted7 ? 'ครบ' : 'กำลังเรียน'),
  },
  {
    name: 'overallAverage',
    label: selectedSkill.value ? `คะแนน${selectedSkill.value.label}` : 'คะแนนเฉลี่ย',
    align: 'center',
    field: (row) => displayScore(row),
    sortable: true,
  },
  {
    name: 'actions',
    label: '',
    align: 'right',
    field: () => '',
  },
]);

// Course is already shown under the name, so the separate column is only kept on wide screens;
// on tablets the status column also goes (the 7/7 progress already says it)
const visibleColumns = computed(() => {
  const all = columns.value.map((c) => c.name);
  if ($q.screen.lt.md) return all.filter((n) => !['courseTitle', 'status'].includes(n));
  if ($q.screen.lt.lg) return all.filter((n) => n !== 'courseTitle');
  return all;
});

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

  return sortChildren(list);
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

.table-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.filter-toggle {
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid #e2e8f0;
}
.filter-toggle :deep(.q-btn) {
  white-space: nowrap;
}
.search-input {
  width: 260px;
}
.sort-control {
  display: flex;
  gap: 6px;
  align-items: stretch;
}
.sort-select {
  width: 200px;
}
.sort-direction {
  white-space: nowrap;
  border-radius: 4px;
}
.sort-option-icon {
  min-width: 32px;
}

.children-table :deep(thead th) {
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
}
.children-table :deep(tbody tr) {
  cursor: pointer;
}
.children-table :deep(tbody tr:hover) {
  background: #f8fafc;
}
.name-sub {
  max-width: 260px;
}

/* 7 Session Step Dots */
.session-dots {
  display: inline-flex;
  gap: 4px;
}
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

.action-btn {
  background: #006c0c !important;
  color: #ffffff;
  border-radius: 6px;
  font-weight: 500;
  white-space: nowrap;
  transition: opacity 0.2s;
}
.action-btn:hover {
  opacity: 0.9;
}

.mobile-item {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
}
.mobile-item:active {
  background: #f8fafc;
}

@media (max-width: 599px) {
  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }
  .search-input {
    width: 100%;
  }
  .sort-select {
    flex: 1 1 auto;
    width: auto;
  }
}
</style>
