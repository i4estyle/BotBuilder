<template>
  <div class="child-radar-chart-container">
    <div v-if="chartReady" class="chart-wrapper">
      <apexchart
        :key="chartKey"
        type="radar"
        :height="height || 360"
        width="100%"
        :options="chartOptions"
        :series="series"
      />
    </div>
    <div v-else class="flex flex-center q-pa-xl text-grey-6 chart-placeholder">
      <q-spinner-dots size="36px" color="primary" />
      <span class="q-ml-sm text-caption">กำลังเตรียมกราฟใยแมงมุม...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import type { ApexOptions } from 'apexcharts';
import { SKILL_DEFINITIONS, type ChildSummary, type OverallStats } from '@/types/report';

const props = defineProps<{
  child: ChildSummary;
  overallStats?: OverallStats | undefined;
  height?: number;
}>();

const chartReady = ref(false);
const renderId = ref(0);

const chartKey = computed(() => {
  return `${props.child.enrollment}-${renderId.value}`;
});

const series = computed(() => {
  const childData = SKILL_DEFINITIONS.map(
    (skill) => props.child.skillAverages?.[skill.key] || 0,
  );

  const groupData = SKILL_DEFINITIONS.map(
    (skill) => props.overallStats?.skillAverages?.[skill.key] || 0,
  );

  return [
    {
      name: `คะแนนของ ${props.child.studentName}`,
      data: childData,
    },
    {
      name: 'เกณฑ์เฉลี่ยภาพรวมผู้เรียน',
      data: groupData,
    },
  ];
});

const chartOptions = computed<ApexOptions>(() => {
  const categories = SKILL_DEFINITIONS.map((s) => s.label);

  return {
    chart: {
      type: 'radar',
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 400,
      },
      fontFamily: "'Sarabun', sans-serif",
    },
    // Green (Student) & Red/Crimson dashed (Cohort Benchmark)
    colors: ['#006c0c', '#bc0100'],
    plotOptions: {
      radar: {
        size: 115,
        offsetX: 0,
        offsetY: 0,
        polygons: {
          strokeColors: '#cbd5e1',
          connectorColors: '#cbd5e1',
          fill: {
            colors: ['#f8fafc', '#ffffff'],
          },
        },
      },
    },
    stroke: {
      width: [3, 2],
      dashArray: [0, 5],
    },
    fill: {
      opacity: [0.35, 0.08],
    },
    markers: {
      size: [5, 4],
      hover: { size: 7 },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 600,
          colors: ['#0f172a', '#0f172a', '#0f172a', '#0f172a', '#0f172a', '#0f172a', '#0f172a'],
        },
      },
    },
    yaxis: {
      min: 0,
      max: 5,
      tickAmount: 5,
      labels: {
        formatter: (val: number) => val.toFixed(0),
        style: {
          fontSize: '11px',
        },
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '13px',
      markers: {
        shape: 'circle',
      },
      itemMargin: {
        horizontal: 10,
        vertical: 4,
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(2)} / 5.0 คะแนน`,
      },
    },
  };
});

function initChart(): void {
  chartReady.value = false;
  renderId.value++;
  setTimeout(() => {
    chartReady.value = true;
    void nextTick(() => {
      window.dispatchEvent(new Event('resize'));
    });
  }, 120);
}

watch(
  () => props.child.enrollment,
  () => {
    initChart();
  },
);

onMounted(() => {
  initChart();
});
</script>

<style scoped>
.child-radar-chart-container {
  width: 100%;
  min-width: 320px;
  min-height: 360px;
}
.chart-wrapper {
  width: 100%;
  min-height: 360px;
}
.chart-placeholder {
  min-height: 360px;
}
</style>
