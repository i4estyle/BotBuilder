<template>
  <q-dialog
    :model-value="modelValue"
    :maximized="$q.screen.lt.sm"
    :transition-show="$q.screen.lt.sm ? 'slide-up' : 'jump-down'"
    :transition-hide="$q.screen.lt.sm ? 'slide-down' : 'jump-up'"
    @update:model-value="(val) => emit('update:modelValue', val)"
    @show="onDialogShow"
    @hide="onDialogHide"
  >
    <q-card v-if="child" class="dialog-card column no-wrap">
      <!-- Modal Header -->
      <q-card-section class="dialog-header text-white row items-center justify-between no-wrap">
        <div style="min-width: 0">
          <div class="row items-center q-gutter-sm">
            <span class="text-h6 text-weight-bold tracking-tight">{{ child.studentName }}</span>
            <q-badge
              :color="child.isCompleted7 ? 'positive' : 'warning'"
              class="q-px-sm q-py-xs text-weight-medium"
            >
              <q-icon
                :name="child.isCompleted7 ? 'check_circle' : 'schedule'"
                size="14px"
                class="q-mr-xs"
              />
              {{
                child.isCompleted7
                  ? 'ผ่านครบหลักสูตร 7 ครั้ง'
                  : `กำลังเรียน (${Math.min(child.completedSessions, 7)}/7 ครั้ง)`
              }}
            </q-badge>
          </div>
          <div v-if="child.courseTitle" class="text-caption text-grey-3 q-mt-xs">
            หลักสูตร: {{ child.courseTitle }}
          </div>
        </div>
        <q-btn flat round dense icon="close" v-close-popup class="text-white q-ml-sm" />
      </q-card-section>

      <!-- Subheader Stats Bar -->
      <div
        class="row items-center justify-around no-wrap bg-grey-1 q-pa-sm text-center border-bottom"
      >
        <div>
          <div class="text-caption text-grey-7">ประเมินแล้ว</div>
          <div class="text-subtitle1 text-weight-bolder text-bb-green">
            {{ child.completedSessions }} / {{ child.totalSessions }} ครั้ง
          </div>
        </div>
        <q-separator vertical />
        <div>
          <div class="text-caption text-grey-7">ความคืบหน้า</div>
          <div
            class="text-subtitle1 text-weight-bolder"
            :class="child.isCompleted7 ? 'text-positive' : 'text-warning'"
          >
            {{ child.completionRate }}%
          </div>
        </div>
        <q-separator vertical />
        <div>
          <div class="text-caption text-grey-7">คะแนนเฉลี่ย</div>
          <div class="text-subtitle1 text-weight-bolder text-bb-green">
            {{ child.overallAverage }}
            <span class="text-caption text-weight-regular text-grey-6">/ 5.0</span>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <q-tabs
        v-model="activeTab"
        dense
        class="text-grey-8 q-mt-xs"
        active-color="primary"
        indicator-color="primary"
        no-caps
        align="left"
        outside-arrows
        mobile-arrows
        @update:model-value="onTabChange"
      >
        <q-tab
          name="radar"
          icon="radar"
          :label="$q.screen.lt.sm ? 'สมรรถนะ' : 'กราฟใยแมงมุมและสมรรถนะ 7 ด้าน'"
        />
        <q-tab
          name="timeline"
          icon="timeline"
          :label="$q.screen.lt.sm ? 'รายครั้ง' : 'พัฒนาการแต่ละครั้ง'"
        />
        <q-tab
          name="comments"
          icon="chat_bubble_outline"
          :label="$q.screen.lt.sm ? 'บันทึก' : 'บันทึกผลการประเมินและสรุป'"
        />
      </q-tabs>
      <q-separator />

      <!-- Tab Panels -->
      <q-tab-panels v-model="activeTab" animated class="q-pa-none col scroll">
        <!-- Tab 1: Radar & Skills -->
        <q-tab-panel name="radar" class="q-pa-md">
          <div class="row q-col-gutter-md items-start">
            <!-- Left: Radar Chart -->
            <div class="col-12 col-md-6">
              <q-card flat bordered class="q-pa-sm bg-white border">
                <div class="text-subtitle2 text-weight-bold text-grey-9 q-mb-xs row items-center">
                  <q-icon name="radar" color="primary" class="q-mr-xs" size="18px" />
                  แผนภูมิใยแมงมุมสมรรถนะ (Competency Spider Chart)
                </div>
                <div class="text-caption text-grey-6 q-mb-sm">
                  เส้นสีเขียว = คะแนนผู้เรียน · เส้นประสีแดง = เกณฑ์เฉลี่ยภาพรวม
                </div>
                <!-- Controlled mount when dialog is ready -->
                <div v-if="isDialogReady" class="radar-box">
                  <ChildRadarChart :child="child" :overall-stats="overallStats" :height="380" />
                </div>
                <div v-else class="radar-placeholder flex flex-center">
                  <q-spinner-dots size="40px" color="primary" />
                </div>
              </q-card>
            </div>

            <!-- Right: 7 Skill Progress Bars -->
            <div class="col-12 col-md-6">
              <q-card flat bordered class="q-pa-md bg-white border">
                <div class="text-subtitle2 text-weight-bold text-grey-9 q-mb-md row items-center">
                  <q-icon name="format_list_bulleted" color="primary" class="q-mr-xs" size="18px" />
                  ระดับคะแนนเฉลี่ยแยกตาม 7 ทักษะหลัก
                </div>
                <div class="q-gutter-y-sm">
                  <div
                    v-for="(skill, idx) in SKILL_DEFINITIONS"
                    :key="skill.key"
                    class="skill-row q-pa-xs rounded-borders bg-grey-1"
                  >
                    <div class="row items-center justify-between text-caption q-mb-xs">
                      <span class="text-weight-bold text-grey-9 row items-center">
                        <q-icon :name="skill.icon" size="16px" class="q-mr-xs text-grey-7" />
                        {{ idx + 1 }}. {{ skill.label }}
                      </span>
                      <span
                        class="text-weight-bold"
                        :class="getScoreBadgeClass(child.skillAverages[skill.key])"
                      >
                        {{ child.skillAverages[skill.key] || 0 }} / 5.0
                      </span>
                    </div>
                    <q-linear-progress
                      :value="(child.skillAverages[skill.key] || 0) / 5"
                      size="7px"
                      rounded
                      :color="getProgressColor(child.skillAverages[skill.key])"
                    />
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </q-tab-panel>

        <!-- Tab 2: Timeline & Progress Line -->
        <q-tab-panel name="timeline" class="q-pa-md">
          <div class="q-mb-md">
            <div class="text-subtitle2 text-weight-bold text-grey-9 q-mb-xs row items-center">
              <q-icon name="trending_up" color="primary" class="q-mr-xs" size="18px" />
              แนวโน้มพัฒนาการตามลำดับบทเรียน (Session Progress Trend)
            </div>
            <div v-if="isDialogReady">
              <ProgressLineChart :child="child" />
            </div>
          </div>

          <q-separator class="q-my-md" />

          <!-- Session List Table -->
          <div class="text-subtitle2 text-weight-bold text-grey-9 q-mb-xs row items-center">
            <q-icon name="table_chart" color="primary" class="q-mr-xs" size="18px" />
            ตารางผลการประเมินรายครั้ง (Session Registry)
          </div>
          <q-markup-table flat bordered dense separator="horizontal" class="border">
            <thead>
              <tr class="bg-grey-2 text-grey-9">
                <th class="text-left font-weight-bold">Session</th>
                <th class="text-left">วันที่เรียน</th>
                <th class="text-center">สถานะ</th>
                <th class="text-center">สมาธิ</th>
                <th class="text-center">กล้ามเนื้อ</th>
                <th class="text-center">หุ่นยนต์</th>
                <th class="text-center">โปรแกรม</th>
                <th class="text-center">แก้ปัญหา</th>
                <th class="text-center">สร้างสรรค์</th>
                <th class="text-center">นำเสนอ</th>
                <th class="text-center font-weight-bold">เฉลี่ย</th>
                <th class="text-right">รูปภาพ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rec in child.records" :key="rec.evaluationId">
                <td class="text-weight-bold text-bb-green">#{{ rec.sessionNumber ?? '-' }}</td>
                <td>{{ rec.sessionDate }}</td>
                <td class="text-center">
                  <q-badge :color="isComplete(rec.status) ? 'positive' : 'warning'">
                    {{ isComplete(rec.status) ? 'เสร็จสิ้น' : 'รอดำเนินการ' }}
                  </q-badge>
                </td>
                <td class="text-center">{{ rec.scores.score1 ?? '-' }}</td>
                <td class="text-center">{{ rec.scores.score2 ?? '-' }}</td>
                <td class="text-center">{{ rec.scores.score3 ?? '-' }}</td>
                <td class="text-center">{{ rec.scores.score4 ?? '-' }}</td>
                <td class="text-center">{{ rec.scores.score5 ?? '-' }}</td>
                <td class="text-center">{{ rec.scores.score6 ?? '-' }}</td>
                <td class="text-center">{{ rec.scores.score7 ?? '-' }}</td>
                <td class="text-center text-weight-bold text-bb-green">
                  {{ rec.averageScore || '-' }}
                </td>
                <td class="text-right">
                  <q-btn
                    v-if="safeLink(rec.googleDriveLink)"
                    flat
                    round
                    dense
                    icon="folder"
                    color="primary"
                    :href="safeLink(rec.googleDriveLink)"
                    target="_blank"
                  >
                    <q-tooltip>เปิด Google Drive</q-tooltip>
                  </q-btn>
                  <span v-else class="text-grey-4">-</span>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-tab-panel>

        <!-- Tab 3: Comments & AI Message -->
        <q-tab-panel name="comments" class="q-pa-md">
          <div class="q-gutter-y-md">
            <div
              v-for="rec in child.records"
              :key="rec.evaluationId"
              class="q-pa-md rounded-borders bg-white border"
            >
              <div class="row items-center justify-between q-col-gutter-sm q-mb-sm">
                <div class="text-subtitle2 text-weight-bold text-bb-green row items-center">
                  <q-icon name="event_note" size="18px" class="q-mr-xs" />
                  บทเรียนที่ {{ rec.sessionNumber ?? '-' }}
                  <span v-if="rec.sessionDate" class="text-weight-regular text-grey-7 q-ml-xs">
                    ({{ rec.sessionDate }})
                  </span>
                </div>
                <div>
                  <q-btn
                    v-if="safeLink(rec.googleDriveLink)"
                    outline
                    no-caps
                    size="sm"
                    color="primary"
                    icon="open_in_new"
                    label="ดูรูปภาพกิจกรรม"
                    :href="safeLink(rec.googleDriveLink)"
                    target="_blank"
                  />
                </div>
              </div>
              <div v-if="!rec.comment && !rec.aiMessage" class="text-caption text-grey-5">
                ยังไม่มีบันทึก
              </div>

              <!-- Comment -->
              <div v-if="rec.comment" class="q-mb-sm">
                <div class="text-caption text-weight-bold text-grey-8">
                  บันทึกผลการประเมินจากผู้สอน:
                </div>
                <div
                  class="text-body2 text-grey-9 q-mt-xs text-preline q-pa-sm bg-grey-1 rounded-borders"
                >
                  {{ rec.comment }}
                </div>
              </div>

              <!-- AI Message -->
              <div v-if="rec.aiMessage" class="q-mt-sm">
                <div class="text-caption text-weight-bold text-grey-8">
                  ข้อความสรุปสำหรับผู้ปกครอง:
                </div>
                <div
                  class="text-body2 text-grey-9 q-mt-xs text-preline q-pa-sm bg-blue-1 rounded-borders border-blue"
                >
                  {{ rec.aiMessage }}
                </div>
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import { SKILL_DEFINITIONS, type ChildSummary, type OverallStats } from '@/types/report';
import ChildRadarChart from './ChildRadarChart.vue';
import ProgressLineChart from './ProgressLineChart.vue';

defineProps<{
  modelValue: boolean;
  child: ChildSummary | null;
  overallStats?: OverallStats | undefined;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const $q = useQuasar();

const activeTab = ref('radar');

function isComplete(status: string): boolean {
  return status.toLowerCase() === 'complete';
}

// Only allow http(s) links from the sheet so a crafted cell can't inject javascript: URLs
function safeLink(url: string): string {
  return /^https?:\/\//i.test((url || '').trim()) ? url.trim() : '';
}
const isDialogReady = ref(false);

function onDialogShow(): void {
  // Give Quasar dialog transition 100ms to finish scaling and calculate accurate DOM dimensions
  setTimeout(() => {
    isDialogReady.value = true;
    void nextTick(() => {
      window.dispatchEvent(new Event('resize'));
    });
  }, 100);
}

function onDialogHide(): void {
  isDialogReady.value = false;
  activeTab.value = 'radar';
}

function onTabChange(): void {
  void nextTick(() => {
    window.dispatchEvent(new Event('resize'));
  });
}

function getProgressColor(val: number): string {
  if (val >= 4.0) return 'positive';
  if (val >= 3.0) return 'primary';
  return 'negative';
}

function getScoreBadgeClass(val: number): string {
  if (val >= 4.0) return 'text-positive';
  if (val >= 3.0) return 'text-primary';
  return 'text-negative';
}
</script>

<style scoped>
.dialog-card {
  width: 920px;
  max-width: 95vw;
  max-height: 92vh;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}
@media (max-width: 599px) {
  .dialog-card {
    width: 100%;
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
    border: 0;
  }
}
.dialog-header {
  background: #006c0c;
  border-bottom: 3px solid #bc0100;
  padding: 16px 20px;
}
.border {
  border: 1px solid #e2e8f0;
}
.border-bottom {
  border-bottom: 1px solid #e2e8f0;
}
.border-blue {
  border: 1px solid #bfdbfe;
}
.text-preline {
  white-space: pre-line;
  line-height: 1.5;
}
.radar-box {
  width: 100%;
  min-height: 360px;
}
.radar-placeholder {
  min-height: 360px;
}
</style>
