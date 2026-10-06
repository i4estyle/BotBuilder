<template>
  <div class="row q-col-gutter-md q-mb-md">
    <!-- Card 1: Total Children -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="kpi-card kpi-card--primary">
        <q-card-section class="row items-center justify-between no-wrap">
          <div>
            <div class="text-caption text-weight-medium text-grey-8">จำนวนผู้เรียนทั้งหมด (Students)</div>
            <div class="text-h4 text-weight-bolder text-grey-10 q-mt-xs">
              {{ stats.totalChildren.toLocaleString() }}
              <span class="text-caption text-weight-regular text-grey-6">คน</span>
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              รวมบันทึกประเมิน {{ stats.totalEvaluations.toLocaleString() }} ครั้ง
            </div>
          </div>
          <div class="kpi-icon-wrap bg-green-1 text-bb-green">
            <q-icon name="people" size="28px" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Card 2: Completed 7 Sessions -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="kpi-card kpi-card--success">
        <q-card-section class="row items-center justify-between no-wrap">
          <div>
            <div class="text-caption text-weight-medium text-bb-green">สำเร็จครบหลักสูตร (7/7 ครั้ง)</div>
            <div class="text-h4 text-weight-bolder text-bb-green q-mt-xs">
              {{ stats.fullyCompletedChildren.toLocaleString() }}
              <span class="text-caption text-weight-regular text-grey-6">คน</span>
            </div>
            <div class="text-caption text-bb-green text-weight-bold q-mt-xs">
              คิดเป็น {{ completionPercent }}% ของผู้เรียนทั้งหมด
            </div>
          </div>
          <div class="kpi-icon-wrap bg-green-2 text-bb-green">
            <q-icon name="task_alt" size="28px" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Card 3: In Progress / Sessions -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="kpi-card kpi-card--warning">
        <q-card-section class="row items-center justify-between no-wrap">
          <div>
            <div class="text-caption text-weight-medium text-grey-8">กำลังศึกษา / รอดำเนินการ</div>
            <div class="text-h4 text-weight-bolder text-grey-10 q-mt-xs">
              {{ stats.inProgressChildren.toLocaleString() }}
              <span class="text-caption text-weight-regular text-grey-6">คน</span>
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              รอบันทึกประเมิน: {{ stats.pendingEvaluations }} รายการ
            </div>
          </div>
          <div class="kpi-icon-wrap bg-orange-1 text-orange-9">
            <q-icon name="pending_actions" size="28px" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Card 4: Overall Average Score -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="kpi-card kpi-card--accent">
        <q-card-section class="row items-center justify-between no-wrap">
          <div>
            <div class="text-caption text-weight-medium text-grey-8">คะแนนสมรรถนะเฉลี่ยรวม</div>
            <div class="text-h4 text-weight-bolder text-bb-green q-mt-xs">
              {{ stats.systemOverallAverage }}
              <span class="text-caption text-weight-regular text-grey-6">/ 5.0</span>
            </div>
            <div class="text-caption text-bb-red text-weight-medium q-mt-xs">
              เกณฑ์มาตรฐาน 7 ด้าน
            </div>
          </div>
          <div class="kpi-icon-wrap bg-red-1 text-bb-red">
            <q-icon name="insights" size="28px" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { OverallStats } from '@/types/report';

const props = defineProps<{
  stats: OverallStats;
}>();

const completionPercent = computed(() => {
  if (props.stats.totalChildren === 0) return 0;
  return Math.round((props.stats.fullyCompletedChildren / props.stats.totalChildren) * 100);
});
</script>

<style scoped>
.kpi-card {
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
  background: #ffffff;
  border: 1px solid #e2e8f0;
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

.kpi-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
