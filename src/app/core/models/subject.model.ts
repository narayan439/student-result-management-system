export interface Subject {
  subjectId?: number;
  subjectName: string;
  subjectCode: string;
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
