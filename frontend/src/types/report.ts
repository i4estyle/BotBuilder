import type { EvaluationRecord, EvaluationScores } from './evaluation';

export interface SkillMeta {
  key: keyof EvaluationScores;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
}

export const SKILL_DEFINITIONS: SkillMeta[] = [
  { key: 'score1', label: 'สมาธิ', shortLabel: 'สมาธิ', icon: 'self_improvement', color: '#6366f1' },
  { key: 'score2', label: 'กล้ามเนื้อ', shortLabel: 'กล้ามเนื้อ', icon: 'fitness_center', color: '#f59e0b' },
  { key: 'score3', label: 'การสร้างหุ่นยนต์', shortLabel: 'สร้างหุ่น', icon: 'smart_toy', color: '#10b981' },
  { key: 'score4', label: 'การเขียนโปรแกรม', shortLabel: 'เขียนโปรแกรม', icon: 'code', color: '#3b82f6' },
  { key: 'score5', label: 'การแก้ปัญหา', shortLabel: 'แก้ปัญหา', icon: 'psychology', color: '#ef4444' },
  { key: 'score6', label: 'ความคิดสร้างสรรค์', shortLabel: 'สร้างสรรค์', icon: 'palette', color: '#8b5cf6' },
  { key: 'score7', label: 'การนำเสนอ', shortLabel: 'นำเสนอ', icon: 'record_voice_over', color: '#ec4899' },
];

export interface ChildSummary {
  enrollment: string;
  studentName: string;
  courseTitle: string;
  totalSessions: number;
  completedSessions: number;
  isCompleted7: boolean;
  completionRate: number; // percentage (0 - 100)
  sessionNumbers: number[];
  skillAverages: Record<keyof EvaluationScores, number>;
  overallAverage: number;
  records: EvaluationRecord[];
}

export interface OverallStats {
  totalChildren: number;
  fullyCompletedChildren: number;
  inProgressChildren: number;
  totalEvaluations: number;
  completedEvaluations: number;
  pendingEvaluations: number;
  systemOverallAverage: number;
  skillAverages: Record<keyof EvaluationScores, number>;
  completedChildrenSkillAverages: Record<keyof EvaluationScores, number>;
}

