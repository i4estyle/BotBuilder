<template>
  <q-card flat bordered class="chart-card">
    <q-card-section class="row items-center justify-between q-pb-none">
      <div>
        <div class="text-subtitle1 text-weight-bold text-grey-9 row items-center">
          <q-icon name="bar_chart" color="primary" class="q-mr-xs" size="20px" />
          เปรียบเทียบระดับคะแนนเฉลี่ย 7 ทักษะ (Skill Benchmark)
        </div>
        <div class="text-caption text-grey-7">
          จัดอันดับคะแนนเฉลี่ยจากสูงไปต่ำ พร้อมเกณฑ์ประเมินระดับความสามารถ
        </div>
      </div>
    </q-card-section>

    <q-card-section class="chart-section">
      <apexchart
        type="bar"
        height="380"
        :options="chartOptions"
        :series="series"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ApexOptions } from 'apexcharts';
import { SKILL_DEFINITIONS, type OverallStats } from '@/types/report';

const props = defineProps<{
  stats: OverallStats;
}>();

const series = computed(() => {
  return [
    {
      name: 'คะแนนเฉลี่ย',
      data: SKILL_DEFINITIONS.map((s) => props.stats.skillAverages[s.key] || 0),
    },
  ];
});

const chartOptions = computed<ApexOptions>(() => {
  return {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: "'Sarabun', sans-serif",
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal: true,
        distributed: true,
        dataLabels: {
          position: 'top',
        },
      },
    },
    // BotBuilder Green and distinct professional palette
    colors: ['#006c0c', '#15803d', '#16a34a', '#22c55e', '#3b82f6', '#6366f1', '#bc0100'],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(2)}`,
      offsetX: 20,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#0f172a'],
      },
    },
    xaxis: {
      categories: SKILL_DEFINITIONS.map((s) => s.label),
      min: 0,
      max: 5,
      labels: {
        formatter: (val: string) => Number(val).toFixed(1),
        style: {
          fontSize: '11px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 600,
          colors: ['#334155'],
        },
      },
    },
    legend: { show: false },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(2)} / 5.0 คะแนน`,
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
  min-height: 400px;
}
</style>
