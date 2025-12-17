export interface Recheck {
  recheckId?: number;
  studentId: number;
  studentEmail?: string;
  rollNo?: string;
  studentName?: string;
  subject: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestDate?: string;
  completionDate?: string;
  notes?: string;
  marksObtained?: number;
  maxMarks?: number;
}

export interface RecheckResponse {
  success: boolean;
  message: string;
  data?: Recheck;
  errors?: string[];
}

export interface RecheckListResponse {
  success: boolean;
  message: string;
  data?: Recheck[];
  errors?: string[];
}
