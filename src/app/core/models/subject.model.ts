export interface Subject {
  subjectId?: number;
  subjectName: string;
  code: string;  // Changed from subjectCode to match backend
  className?: string;  // Class name (e.g., 'Class 10', 'Class 11')
  description?: string;
  isActive?: boolean;
}

export interface SubjectResponse {
  success: boolean;
  data?: Subject;
  message?: string;
}

export interface SubjectListResponse {
  success: boolean;
  data: Subject[];
  message?: string;
}
