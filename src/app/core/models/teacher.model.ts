export interface Teacher {
  teacherId?: string;
  name: string;
  email: string;
  subjects: string[]; // Multiple subjects
  phone?: string;
  experience?: number;
  isActive?: boolean;
}

export interface TeacherResponse {
  success: boolean;
  message: string;
  data?: Teacher;
  errors?: string[];
}

export interface TeacherListResponse {
  success: boolean;
  message: string;
  data?: Teacher[];
  errors?: string[];
}
