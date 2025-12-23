export interface Recheck {
  studentRoll: any;
  recheckId?: number;
  studentId: number;
  marksId: number;  // New field from schema
  studentEmail?: string;
  rollNo?: string;
  studentName?: string;
  subject: string;
  reason: string;
  adminNotes?: string;  // New field from schema (admin_notes)
  status: 'pending' | 'approved' | 'rejected' | 'PENDING' | 'APPROVED' | 'REJECTED';
  requestDate: string;
  resolvedDate?: string;  // New field from schema (resolved_date)
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
