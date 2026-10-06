<template>
  <q-card flat bordered class="chart-card">
    <q-card-section class="row items-center justify-between q-pb-none">
      <div>
        <div class="text-subtitle1 text-weight-bold text-grey-9 row items-center">
          <q-icon name="pie_chart" color="primary" class="q-mr-xs" size="20px" />
          สัดส่วนการสำเร็จหลักสูตร 7 ครั้ง (Completion Ratio)
        </div>
        <div class="text-caption text-grey-7">
          สัดส่วนผู้เรียนที่สำเร็จครบ 7 บทเรียน เทียบกับกลุ่มที่กำลังศึกษา
        </div>
      </div>
    </q-card-section>

    <q-card-section class="chart-section flex flex-center">
      <div v-if="stats.totalChildren > 0" class="full-width">
        <apexchart
          type="donut"
          height="340"
          :options="chartOptions"
          :series="series"
        />
        <div class="row justify-around q-mt-md text-center border-top q-pt-sm">
          <div>
            <div class="text-caption text-grey-7">สำเร็จครบ 7 ครั้ง</div>
            <div class="text-subtitle1 text-weight-bolder text-bb-green">
              {{ stats.fullyCompletedChildren }} คน
            </div>
          </div>
          <q-separator vertical />
          <div>
            <div class="text-caption text-grey-7">กำลังศึกษา / รอดำเนินการ</div>
            <div class="text-subtitle1 text-weight-bolder text-bb-red">
              {{ stats.inProgressChildren }} คน
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ApexOptions } from 'apexcharts';
import type { OverallStats } from '@/types/report';

const props = defineProps<{
  stats: OverallStats;
}>();

const series = computed(() => {
  return [props.stats.fullyCompletedChildren, props.stats.inProgressChildren];
});

const chartOptions = computed<ApexOptions>(() => {
  return {
    chart: {
      type: 'donut',
      fontFamily: "'Sarabun', sans-serif",
    },
    labels: ['สำเร็จครบ 7 ครั้ง (7/7)', 'กำลังศึกษา / ไม่ครบ (<7)'],
    // Forest Green & BotBuilder Red
    colors: ['#006c0c', '#bc0100'],
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'ผู้เรียนทั้งหมด',
              formatter: () => `${props.stats.totalChildren} คน`,
              color: '#0f172a',
              fontSize: '14px',
              fontWeight: 600,
            },
          },
        },
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      markers: {
        shape: 'circle',
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} คน`,
      },
    },
  };
});
</script>

<style scoped>
.chart-card {
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
}
.chart-section {
  min-height: 380px;
}
.border-top {
  border-top: 1px solid #e2e8f0;
}
</style>
