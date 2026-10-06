export interface EvaluationScores {
  score1: number | null;
  score2: number | null;
  score3: number | null;
  score4: number | null;
  score5: number | null;
  score6: number | null;
  score7: number | null;
}

export interface EvaluationRecord {
  evaluationId: string;
  evaluationTitle: string;
  enrollment: string;
  sessionNumber: number | null;
  sessionDate: string;
  comment: string;
  googleDriveLink: string;
  status: string;
  scores: EvaluationScores;
  totalScore: number;
  averageScore: number;
  teacherNote: string;
  aiMessage: string;
  genMessage: string;
  lineSentStatus: string;
}

export interface GoogleSheetsEvaluationsResponse {
  sheetTitle: string;
  spreadsheetId: string;
  totalRows: number;
  lastUpdated: string;
  records: EvaluationRecord[];
}

