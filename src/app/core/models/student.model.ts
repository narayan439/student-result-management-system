export interface Student {
  studentId?: number;
  name: string;
  email: string;
  className: string;
  rollNo: string;
  dob: string;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentResponse {
  success: boolean;
  message: string;
  data?: Student;
  errors?: string[];
}

export interface StudentListResponse {
  success: boolean;
  message: string;
  data?: Student[];
  errors?: string[];
}
