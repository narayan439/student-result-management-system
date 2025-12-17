export interface Mark {
	marksId?: string;
	studentId: string;
	subject: string;
	marksObtained: number;
	maxMarks?: number;
	term?: string; // e.g., 'Term 1', 'Term 2'
	year?: number;
	isRecheckRequested?: boolean;
}

export interface MarkResponse {
	success: boolean;
	data?: Mark;
	message?: string;
}

export interface MarkListResponse {
	success: boolean;
	data: Mark[];
	message?: string;
}
