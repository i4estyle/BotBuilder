<template>
  <q-card flat bordered class="chart-card">
    <q-card-section class="row items-center justify-between q-pb-none">
      <div>
        <div class="text-subtitle1 text-weight-bold text-grey-9 row items-center">
          <q-icon name="radar" color="primary" class="q-mr-xs" size="20px" />
          แผนภูมิใยแมงมุมสมรรถนะ 7 ด้าน (Overall Competency Radar)
        </div>
        <div class="text-caption text-grey-7">
          เปรียบเทียบค่าเฉลี่ยสมรรถนะของผู้เรียนทุกคน กับกลุ่มที่สำเร็จหลักสูตร 7 บทเรียน
        </div>
      </div>
      <q-badge color="grey-2" text-color="grey-9" class="q-pa-xs border">
        เกณฑ์คะแนน 1.0 - 5.0
      </q-badge>
    </q-card-section>

    <q-card-section class="chart-section flex flex-center">
      <div v-if="hasData" class="full-width">
        <apexchart
          type="radar"
          height="400"
          :options="chartOptions"
          :series="series"
        />
      </div>
      <div v-else class="text-grey-6 q-pa-xl text-center">
        <q-spinner-dots size="40px" color="primary" />
        <div class="q-mt-sm text-caption">กำลังประมวลผลข้อมูลกราฟใยแมงมุม...</div>
      </div>
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

const hasData = computed(() => {
  return props.stats.totalEvaluations > 0;
});

const series = computed(() => {
  const allAvgValues = SKILL_DEFINITIONS.map(
    (skill) => props.stats.skillAverages[skill.key] || 0,
  );

  const completedAvgValues = SKILL_DEFINITIONS.map(
    (skill) => props.stats.completedChildrenSkillAverages[skill.key] || 0,
  );

  return [
    {
      name: 'คะแนนเฉลี่ยผู้เรียนทุกคน',
      data: allAvgValues,
    },
    {
      name: 'คะแนนเฉลี่ยกลุ่มเรียนครบ 7 ครั้ง',
      data: completedAvgValues,
    },
  ];
});

const chartOptions = computed<ApexOptions>(() => {
  const categories = SKILL_DEFINITIONS.map((s) => s.label);

  return {
    chart: {
      type: 'radar',
      toolbar: {
        show: true,
        tools: {
          download: true,
        },
      },
      animations: {
        enabled: true,
        speed: 500,
      },
      fontFamily: "'Sarabun', sans-serif",
    },
    plotOptions: {
      radar: {
        size: 120,
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
    // Forest Green & Crimson Red
    colors: ['#006c0c', '#bc0100'],
    stroke: {
      width: [2.5, 2],
      dashArray: [0, 4],
    },
    fill: {
      opacity: [0.25, 0.08],
    },
    markers: {
      size: [4, 4],
      hover: {
        size: 7,
      },
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
        formatter: (val: number) => val.toFixed(1),
        style: {
          fontSize: '10px',
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
        horizontal: 14,
        vertical: 6,
      },
    },
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
.border {
  border: 1px solid #e2e8f0;
}
</style>
