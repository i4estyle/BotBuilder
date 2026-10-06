import { defineStore, acceptHMRUpdate } from 'pinia';
import { googleSheetsApiService } from '@/services/google-sheets-api.service';
import type { EvaluationRecord, EvaluationScores } from '@/types/evaluation';
import { SKILL_DEFINITIONS, type ChildSummary, type OverallStats } from '@/types/report';
import axios from 'axios';

interface EvaluationState {
  records: EvaluationRecord[];
  sheetTitle: string;
  spreadsheetId: string;
  lastUpdated: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | null;
  autoRefreshEnabled: boolean;
  autoRefreshIntervalSeconds: number;
  pollingTimer: ReturnType<typeof setInterval> | null;
}

export const useEvaluationStore = defineStore('evaluation', {
  state: (): EvaluationState => ({
    records: [],
    sheetTitle: '',
    spreadsheetId: '',
    lastUpdated: null,
    isLoading: false,
    isRefreshing: false,
    errorMessage: null,
    autoRefreshEnabled: false,
    autoRefreshIntervalSeconds: 10,
    pollingTimer: null,
  }),

  getters: {
    totalCount: (state): number => state.records.length,

    completedCount: (state): number =>
      state.records.filter((r) => r.status.toLowerCase() === 'complete').length,

    pendingCount: (state): number =>
      state.records.filter((r) => r.status.toLowerCase() === 'pending').length,

    overallAverageScore: (state): number => {
      const recordsWithAvg = state.records.filter((r) => r.averageScore > 0);
      if (recordsWithAvg.length === 0) return 0;
      const sum = recordsWithAvg.reduce((acc, curr) => acc + curr.averageScore, 0);
      return Number((sum / recordsWithAvg.length).toFixed(2));
    },

    /**
     * Group evaluations by Enrollment (child) and compute completion and skill averages
     */
    childrenSummaries: (state): ChildSummary[] => {
      const groups = new Map<string, EvaluationRecord[]>();

      state.records.forEach((rec) => {
        const key = rec.enrollment || rec.evaluationTitle || 'Unknown';
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key)!.push(rec);
      });

      const summaries: ChildSummary[] = [];

      groups.forEach((childRecords, enrollment) => {
        // Parse name and course from enrollment e.g. "#111 รอย - Intermediate Level 5"
        let studentName = enrollment;
        let courseTitle = '';
        if (enrollment.includes('-')) {
          const parts = enrollment.split('-');
          studentName = parts[0]?.trim() ?? enrollment;
          courseTitle = parts.slice(1).join('-').trim();
        }

        const sortedRecords = [...childRecords].sort((a, b) => {
          return (a.sessionNumber ?? 0) - (b.sessionNumber ?? 0);
        });

        const completedRecords = sortedRecords.filter(
          (r) => r.status.toLowerCase() === 'complete',
        );

        const totalSessions = sortedRecords.length;
        const completedSessions = completedRecords.length;
        const isCompleted7 = completedSessions >= 7;
        const completionRate = Math.min(100, Math.round((completedSessions / 7) * 100));

        const sessionNumbers = sortedRecords
          .map((r) => r.sessionNumber)
          .filter((n): n is number => n !== null);

        // Calculate skill averages for this child
        const skillAverages = {} as Record<keyof EvaluationScores, number>;
        let sumAverages = 0;
        let validSkillCount = 0;

        SKILL_DEFINITIONS.forEach((skill) => {
          const validScores = sortedRecords
            .map((r) => r.scores[skill.key])
            .filter((v): v is number => v !== null && v > 0);

          if (validScores.length > 0) {
            const avg = Number(
              (validScores.reduce((acc, curr) => acc + curr, 0) / validScores.length).toFixed(2),
            );
            skillAverages[skill.key] = avg;
            sumAverages += avg;
            validSkillCount++;
          } else {
            skillAverages[skill.key] = 0;
          }
        });

        const overallAverage =
          validSkillCount > 0 ? Number((sumAverages / validSkillCount).toFixed(2)) : 0;

        summaries.push({
          enrollment,
          studentName,
          courseTitle,
          totalSessions,
          completedSessions,
          isCompleted7,
          completionRate,
          sessionNumbers,
          skillAverages,
          overallAverage,
          records: sortedRecords,
        });
      });

      // Sort by student name / enrollment
      return summaries.sort((a, b) => a.studentName.localeCompare(b.studentName, 'th'));
    },

    /**
     * Compute system-wide overall statistics
     */
    overallStats: (state): OverallStats => {
      const recordsWithScores = state.records.filter((r) => r.status.toLowerCase() === 'complete');

      const skillAverages = {} as Record<keyof EvaluationScores, number>;
      SKILL_DEFINITIONS.forEach((skill) => {
        const scores = recordsWithScores
          .map((r) => r.scores[skill.key])
          .filter((s): s is number => s !== null && s > 0);
        skillAverages[skill.key] =
          scores.length > 0 ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)) : 0;
      });

      // Children summary
      const groups = new Map<string, EvaluationRecord[]>();
      state.records.forEach((rec) => {
        const key = rec.enrollment || 'Unknown';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(rec);
      });

      let fullyCompletedCount = 0;
      const completedChildrenRecords: EvaluationRecord[] = [];

      groups.forEach((recs) => {
        const completed = recs.filter((r) => r.status.toLowerCase() === 'complete').length;
        if (completed >= 7) {
          fullyCompletedCount++;
          completedChildrenRecords.push(...recs);
        }
      });

      const completedChildrenSkillAverages = {} as Record<keyof EvaluationScores, number>;
      SKILL_DEFINITIONS.forEach((skill) => {
        const scores = completedChildrenRecords
          .map((r) => r.scores[skill.key])
          .filter((s): s is number => s !== null && s > 0);
        completedChildrenSkillAverages[skill.key] =
          scores.length > 0
            ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2))
            : skillAverages[skill.key];
      });

      const totalChildren = groups.size;

      return {
        totalChildren,
        fullyCompletedChildren: fullyCompletedCount,
        inProgressChildren: Math.max(0, totalChildren - fullyCompletedCount),
        totalEvaluations: state.records.length,
        completedEvaluations: state.records.filter((r) => r.status.toLowerCase() === 'complete').length,
        pendingEvaluations: state.records.filter((r) => r.status.toLowerCase() === 'pending').length,
        systemOverallAverage:
          state.records.length > 0
            ? Number(
                (
                  state.records.reduce((a, b) => a + (b.averageScore || 0), 0) /
                  (state.records.filter((r) => r.averageScore > 0).length || 1)
                ).toFixed(2),
              )
            : 0,
        skillAverages,
        completedChildrenSkillAverages,
      };
    },
  },

  actions: {
    async fetchEvaluations(options: { silent?: boolean } = {}): Promise<void> {
      if (options.silent) {
        this.isRefreshing = true;
      } else {
        this.isLoading = true;
      }
      this.errorMessage = null;

      try {
        const response = await googleSheetsApiService.getEvaluations();
        this.records = response.records;
        this.sheetTitle = response.sheetTitle;
        this.spreadsheetId = response.spreadsheetId;
        this.lastUpdated = response.lastUpdated;
      } catch (err: unknown) {
        let msg = 'Failed to fetch Google Sheet data.';
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || err.message;
        } else if (err instanceof Error) {
          msg = err.message;
        }
        this.errorMessage = msg;
      } finally {
        this.isLoading = false;
        this.isRefreshing = false;
      }
    },

    startAutoRefresh(seconds = 10): void {
      this.stopAutoRefresh();
      this.autoRefreshIntervalSeconds = seconds;
      this.autoRefreshEnabled = true;

      this.pollingTimer = setInterval(() => {
        void this.fetchEvaluations({ silent: true });
      }, seconds * 1000);
    },

    stopAutoRefresh(): void {
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer);
        this.pollingTimer = null;
      }
      this.autoRefreshEnabled = false;
    },

    toggleAutoRefresh(): void {
      if (this.autoRefreshEnabled) {
        this.stopAutoRefresh();
      } else {
        this.startAutoRefresh(this.autoRefreshIntervalSeconds);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEvaluationStore, import.meta.hot));
}
