<template>
  <div class="progress-line-chart">
    <div v-if="hasMultipleSessions">
      <apexchart
        type="line"
        height="280"
        :options="chartOptions"
        :series="series"
      />
    </div>
    <div v-else class="text-grey-6 text-center q-pa-md">
      <q-icon name="info" size="24px" class="q-mr-xs" />
      ผู้เรียนมีข้อมูลเพียง 1 Session ไม่สามารถพล็อตกราฟพัฒนาการตามเวลาได้
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ApexOptions } from 'apexcharts';
import { SKILL_DEFINITIONS, type ChildSummary } from '@/types/report';

const props = defineProps<{
  child: ChildSummary;
}>();

const hasMultipleSessions = computed(() => {
  return props.child.records.length > 1;
});

const series = computed(() => {
  return SKILL_DEFINITIONS.map((skill) => {
    const data = props.child.records.map((r) => {
      const val = r.scores[skill.key];
      return val !== null && val !== undefined ? val : null;
    });

    return {
      name: skill.label,
      data,
    };
  });
});

const chartOptions = computed<ApexOptions>(() => {
  const categories = props.child.records.map((r) => `Session ${r.sessionNumber ?? '?'}`);

  return {
    chart: {
      type: 'line',
      toolbar: { show: false },
      animations: { enabled: true },
      fontFamily: "'Sarabun', sans-serif",
    },
    colors: SKILL_DEFINITIONS.map((s) => s.color),
    stroke: {
      width: 2.5,
      curve: 'smooth',
    },
    markers: {
      size: 5,
      hover: { size: 7 },
    },
    xaxis: {
      categories,
    },
    yaxis: {
      min: 1,
      max: 5,
      tickAmount: 4,
      labels: {
        formatter: (val: number) => val.toFixed(0),
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '11px',
    },
    tooltip: {
      y: {
        formatter: (val: number) => (val !== null ? `${val} / 5` : 'ไม่มีคะแนน'),
      },
    },
  };
});
</script>

<style scoped>
.progress-line-chart {
  width: 100%;
}
</style>

