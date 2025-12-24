import { Component, OnInit } from '@angular/core';
import { MarksService } from '../../../core/services/marks.service';
import { StudentService } from '../../../core/services/student.service';

@Component({
  selector: 'app-update-marks',
  templateUrl: './update-marks.component.html',
  styleUrls: ['./update-marks.component.css'],
  standalone: false
})
export class UpdateMarksComponent implements OnInit {

  marksList: any[] = [];
  studentsList: any[] = [];
  filteredStudents: any[] = [];
  isLoading = true;
  submitError = '';
  submitSuccess = '';
  isSubmitting = false;
  editingMarkId: number | null = null;
  editedMarks: { [key: number]: number } = {};
  
  // Search and expand functionality
  searchTerm: string = '';
  expandedStudents: { [key: number]: boolean } = {};

  // Class-wise filter
  selectedClassName: string = '';
  classOptions: string[] = [];

  displayedColumns: string[] = ['studentName', 'subjectName', 'marksObtained', 'actions'];

  constructor(
    private marksService: MarksService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.loadAllMarks();
  }

  /**
   * Load all marks from backend
   */
  loadAllMarks(): void {
    this.marksList = [];
    this.studentsList = [];
    this.filteredStudents = [];
    this.isLoading = true;
    this.submitError = '';
    this.submitSuccess = '';
    this.editingMarkId = null;
    this.editedMarks = {};
    this.expandedStudents = {};

    this.marksService.getAllMarks().subscribe({
      next: (response: any) => {
        const marks = response.data || response || [];
        this.enrichMarksData(marks);
      },
      error: (err) => {
        console.error('Error loading marks:', err);
        this.submitError = 'Failed to load marks. Please try again.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Enrich marks with student and subject names
   */
  private enrichMarksData(marks: any[]): void {
    this.studentService.getAllStudents().subscribe({
      next: (students: any) => {
        // Enrich each mark record
        this.marksList = marks.map((mark: any) => {
          const student: any = students.find((s: any) => s.studentId === mark.studentId);
          const subjectName = mark.subject || mark.subjectName || `Subject ${mark.subjectId}`;

          return {
            ...mark,
            studentId: mark.studentId,
            studentName: student?.name || 'Unknown',
            rollNo: student?.rollNo || 'N/A',
            subjectName: subjectName,
            className: student?.className || 'N/A'
          };
        });

        this.groupMarksByStudent();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching student data:', err);
        this.submitError = 'Failed to load student data. Please refresh the page.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Group marks by student
   */
  private groupMarksByStudent(): void {
    const groupedMarks: { [key: number]: any[] } = {};
    this.studentsList = [];

    this.marksList.forEach((mark: any) => {
      const key = mark.studentId;
      if (!groupedMarks[key]) {
        groupedMarks[key] = [];
        this.studentsList.push({
          studentId: mark.studentId,
          studentName: mark.studentName,
          rollNo: mark.rollNo,
          className: mark.className,
          marks: []
        });
      }
      groupedMarks[key].push(mark);
    });

    // Update student marks
    this.studentsList.forEach(student => {
      student.marks = groupedMarks[student.studentId] || [];
    });

    // Initially filter and expand all
    this.classOptions = Array.from(
      new Set(
        this.studentsList
          .map((s: any) => (s?.className || '').toString().trim())
          .filter((v: string) => !!v && v !== 'N/A')
      )
    ).sort((a, b) => a.localeCompare(b));

    this.applyFilters();
    this.studentsList.forEach(student => {
      this.expandedStudents[student.studentId] = false;
    });
  }

  /**
   * Filter marks based on search term
   */
  filterMarks(): void {
    this.applyFilters();
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  /**
   * Clear ALL filters
   */
  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedClassName = '';
    this.filteredStudents = [...this.studentsList];
  }

  /**
   * Apply class + search filters together
   */
  applyFilters(): void {
    let list = [...this.studentsList];

    if (this.selectedClassName) {
      const selected = this.selectedClassName.toLowerCase();
      list = list.filter((s: any) => (s?.className || '').toString().toLowerCase() === selected);
    }

    const search = this.searchTerm.toLowerCase().trim();
    if (search) {
      list = list.filter(student => {
        return (
          student.studentName.toLowerCase().includes(search) ||
          student.rollNo.toLowerCase().includes(search) ||
          student.className.toLowerCase().includes(search) ||
          student.marks.some((mark: any) => mark.subjectName.toLowerCase().includes(search))
        );
      });
    }

    this.filteredStudents = list;
  }

  /**
   * Toggle student expansion
   */
  toggleStudentExpansion(studentId: number): void {
    this.expandedStudents[studentId] = !this.expandedStudents[studentId];
  }

  /**
   * Start editing a mark
   */
  editMark(mark: any): void {
    this.editingMarkId = mark.marksId;
    this.editedMarks[mark.marksId] = mark.marksObtained;
    this.submitError = '';
  }

  /**
   * Cancel editing
   */
  cancelEdit(): void {
    this.editingMarkId = null;
    this.editedMarks = {};
    this.submitError = '';
  }

  /**
   * Save updated mark
   */
  saveMark(mark: any): void {
    const newMarks = this.editedMarks[mark.marksId];

    if (newMarks === undefined || newMarks === null) {
      this.submitError = 'Please enter a valid mark value';
      return;
    }

    if (newMarks < 0 || newMarks > 100) {
      this.submitError = 'Marks must be between 0 and 100';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const updateRequest = {
      marksObtained: newMarks,
      maxMarks: mark.maxMarks ?? 100,
      term: mark.term ?? 'Term 1',
      year: mark.year ?? new Date().getFullYear(),
      isRecheckRequested: mark.isRecheckRequested ?? false
    };

    this.marksService.updateMarks(mark.marksId, updateRequest).subscribe({
      next: (response: any) => {
        // Update the mark in the list
        const index = this.marksList.findIndex(m => m.marksId === mark.marksId);
        if (index !== -1) {
          this.marksList[index].marksObtained = newMarks;
          this.marksList[index].maxMarks = updateRequest.maxMarks;
        }

        // Refresh grouped view
        this.groupMarksByStudent();

        this.submitSuccess = `✓ Mark updated successfully for ${mark.studentName} - ${mark.subjectName}`;
        this.editingMarkId = null;
        this.editedMarks = {};
        this.isSubmitting = false;

        setTimeout(() => {
          this.submitSuccess = '';
        }, 3000);
      },
      error: (err: any) => {
        const errorMsg = err.error?.message || err.message || 'Failed to update mark';
        this.submitError = `Error: ${errorMsg}`;
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Delete a mark
   */
  deleteMark(mark: any): void {
    if (!confirm(`Are you sure you want to delete marks for ${mark.studentName} - ${mark.subjectName}?`)) {
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    this.marksService.deleteMarks(mark.marksId).subscribe({
      next: (response: any) => {
        this.marksList = this.marksList.filter(m => m.marksId !== mark.marksId);
        this.groupMarksByStudent();
        
        this.submitSuccess = `✓ Mark deleted successfully for ${mark.studentName} - ${mark.subjectName}`;
        this.isSubmitting = false;

        setTimeout(() => {
          this.submitSuccess = '';
        }, 3000);
      },
      error: (err: any) => {
        const errorMsg = err.error?.message || err.message || 'Failed to delete mark';
        this.submitError = `Error: ${errorMsg}`;
        this.isSubmitting = false;
      }
    });
  }


  // Add these methods to your component class

/**
 * Toggle filter by status
 */
toggleFilter(filterType: string): void {
  if (!filterType) {
    this.filteredStudents = [...this.studentsList];
    return;
  }

  switch (filterType) {
    case 'pending':
      // Filter students with any pending marks
      this.filteredStudents = this.studentsList.filter(student => 
        student.marks.some((mark: any) => 
          !mark.marksObtained || mark.marksObtained === null
        )
      );
      break;
    
    case 'pass':
      // Filter students with all passing marks
      this.filteredStudents = this.studentsList.filter(student => 
        student.marks.every((mark: any) => 
          mark.marksObtained >= 33
        )
      );
      break;
    
    case 'fail':
      // Filter students with any failing marks
      this.filteredStudents = this.studentsList.filter(student => 
        student.marks.some((mark: any) => 
          mark.marksObtained < 33
        )
      );
      break;
    
    default:
      this.filteredStudents = [...this.studentsList];
  }
}

  /**
   * Refresh the marks list
   */
  refreshMarks(): void {
    this.loadAllMarks();
  }
}