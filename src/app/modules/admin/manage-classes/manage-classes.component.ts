import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ClassesService, SchoolClass } from '../../../core/services/classes.service';
import { StudentService } from '../../../core/services/student.service';
import { SubjectService } from '../../../core/services/subject.service';

@Component({
  selector: 'app-manage-classes',
  templateUrl: './manage-classes.component.html',
  styleUrls: ['./manage-classes.component.css']
})
export class ManageClassesComponent implements OnInit {

  displayedColumns: string[] = ['className', 'classNumber', 'subjects', 'studentCount', 'actions'];
  dataSource!: MatTableDataSource<SchoolClass>;
  
  classes: SchoolClass[] = [];
  filteredClasses: SchoolClass[] = [];
  
  // View mode
  viewMode: 'table' | 'cards' = 'table';
  
  // Form state
  showAddForm = false;
  showEditForm = false;
  editingClass: SchoolClass | null = null;
  
  // Form inputs
  newClassName = '';
  newClassNumber: number | null = null;
  newSubjectList = '';
  selectedSubjectIds: number[] = [];
  
  // Filter
  searchTerm = '';
  selectedClass: string = '';
  
  // Loading state
  isLoading = false;
  showDeletedClasses = false;  // Toggle to show/hide deleted classes
  showSubjectSelector = false;
  
  classNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  students: any[] = [];
  allSubjects: any[] = [];

  constructor(private classesService: ClassesService, private studentService: StudentService, private subjectService: SubjectService) {
    this.dataSource = new MatTableDataSource(this.classes);
  }

  get activeClassesCount(): number {
    return this.classes.filter(c => c.isActive !== false).length;
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadClasses();
    this.loadAllSubjects();
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (students: any) => {
        this.students = Array.isArray(students) ? students : [];
      },
      error: (err: any) => {
        console.error('Error loading students:', err);
        this.students = [];
      }
    });
  }

  getStudentCountForClass(classNumber: number): number {
    if (!this.students.length) return 0;
    return this.students.filter(s => s.className === `Class ${classNumber}`).length;
  }

  loadClasses(): void {
    this.isLoading = true;
    console.log('Loading classes from service...');
    
    // Load from backend API
    this.classesService.getAllClasses().subscribe({
      next: (response: any) => {
        console.log('✓ Classes loaded successfully:', response);
        const classesArray = Array.isArray(response.data) ? response.data : [];
        console.log('Classes array:', classesArray);
        this.classes = classesArray;
        this.filterClasses();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('✗ Error loading classes:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Full error:', err);
        
        // Fallback to cached classes
        this.classes = this.classesService.getClassesArray();
        this.filterClasses();
        this.isLoading = false;
        alert('Error loading classes: ' + (err.error?.message || err.message || 'Unknown error'));
      }
    });
  }

  // Update class name based on class number
  updateClassName(): void {
    if (this.newClassNumber) {
      this.newClassName = `Class ${this.newClassNumber}`;
      // Auto-load subjects when class number is changed
      this.autoLoadSubjects();
    }
  }

  // Auto-load subjects for selected class
  autoLoadSubjects(): void {
    console.log('Auto-loading subjects for class:', this.newClassNumber);
    
    if (!this.newClassNumber) {
      this.newSubjectList = '';
      return;
    }

    // Load all subjects from the backend
    this.subjectService.getAllSubjects().subscribe({
      next: (response: any) => {
        console.log('✓ Subjects loaded:', response);
        
        // Extract subjects from response
        let subjects: any[] = [];
        
        if (response && response.data) {
          subjects = Array.isArray(response.data) ? response.data : [response.data];
        } else if (Array.isArray(response)) {
          subjects = response;
        }
        
        console.log('Extracted subjects:', subjects);
        
        // Map subject names and join with comma
        const subjectNames = subjects
          .map((s: any) => s.subjectName || s.name || '')
          .filter((name: string) => name.trim() !== '')
          .join(', ');
        
        console.log('Subject names joined:', subjectNames);
        
        // Set the subjects list
        this.newSubjectList = subjectNames;
        this.allSubjects = subjects;
      },
      error: (err: any) => {
        console.error('✗ Error loading subjects:', err);
        // Clear subjects if error
        this.newSubjectList = '';
        this.allSubjects = [];
      }
    });
  }

  // Load subjects initially (for display in dropdowns/suggestions)
  loadAllSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: (response: any) => {
        console.log('Subjects loaded:', response);
        this.allSubjects = Array.isArray(response.data) ? response.data : [];
      },
      error: (err: any) => {
        console.error('Error loading subjects:', err);
        this.allSubjects = [];
      }
    });
  }

  // Toggle subject selector
  toggleSubjectSelector(): void {
    this.showSubjectSelector = !this.showSubjectSelector;
  }

  // Handle subject checkbox selection
  onSubjectChange(subjectId: number, event: any): void {
    if (event.checked) {
      // Add subject to selected list
      if (!this.selectedSubjectIds.includes(subjectId)) {
        this.selectedSubjectIds.push(subjectId);
      }
    } else {
      // Remove subject from selected list
      this.selectedSubjectIds = this.selectedSubjectIds.filter(id => id !== subjectId);
    }
    
    // Update the subject list string
    this.updateSubjectListFromSelection();
  }

  // Check if subject is selected
  isSubjectSelected(subjectId: number): boolean {
    return this.selectedSubjectIds.includes(subjectId);
  }

  // Update subject list string from selected IDs
  updateSubjectListFromSelection(): void {
    const selectedSubjects = this.allSubjects.filter(s => this.selectedSubjectIds.includes(s.subjectId));
    const subjectNames = selectedSubjects
      .map((s: any) => s.subjectName || s.name)
      .join(', ');
    this.newSubjectList = subjectNames;
    console.log('Updated subject list:', this.newSubjectList);
  }

  // Parse subject list string into IDs for editing
  parseSubjectListToIds(subjectListString: string): void {
    if (!subjectListString) {
      this.selectedSubjectIds = [];
      return;
    }

    const subjectNames = subjectListString.split(',').map(s => s.trim());
    this.selectedSubjectIds = this.allSubjects
      .filter((s: any) => subjectNames.includes(s.subjectName || s.name))
      .map((s: any) => s.subjectId);
    
    console.log('Parsed subject IDs:', this.selectedSubjectIds);
  }

  // Toggle view mode
  toggleViewMode(mode: 'table' | 'cards'): void {
    this.viewMode = mode;
  }

  // Toggle add form
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  // Toggle edit form
  toggleEditForm(schoolClass?: SchoolClass): void {
    if (schoolClass) {
      this.editingClass = schoolClass;
      this.newClassName = schoolClass.className;
      this.newClassNumber = schoolClass.classNumber;
      this.newSubjectList = schoolClass.subjectList || '';
      // Parse existing subjects into selected IDs
      this.parseSubjectListToIds(this.newSubjectList);
      this.showEditForm = true;
    } else {
      this.showEditForm = false;
      this.resetForm();
    }
  }

  // Add new class
  addClass(): void {
    if (!this.newClassName.trim() || !this.newClassNumber) {
      alert('Please fill all fields');
      return;
    }

    // Check for duplicate class
    if (this.classes.some(c => c.classNumber === this.newClassNumber && (!this.editingClass || c.classId !== this.editingClass.classId))) {
      alert('This class already exists!');
      return;
    }

    const newClass: SchoolClass = {
      classId: 0, // Backend will generate this
      className: this.newClassName.trim(),
      classNumber: this.newClassNumber!,
      maxCapacity: 60,
      isActive: true,
      subjectList: this.newSubjectList.trim()
    };

    this.classesService.createClass(newClass).subscribe({
      next: (response: any) => {
        alert('✓ Class added successfully!');
        this.resetForm();
        this.showAddForm = false;
        this.loadClasses();
      },
      error: (err: any) => {
        const errorMsg = err.error?.message || 'Failed to add class';
        alert('Error: ' + errorMsg);
        console.error('Error adding class:', err);
      }
    });
  }

  // Update class
  updateClass(): void {
    if (!this.editingClass) return;

    if (!this.newClassName.trim() || !this.newClassNumber) {
      alert('Please fill all fields');
      return;
    }

    // Check for duplicate class
    if (this.classes.some(c => c.classNumber === this.newClassNumber && c.classId !== this.editingClass!.classId)) {
      alert('This class already exists!');
      return;
    }

    const updatedClass: SchoolClass = {
      ...this.editingClass!,
      className: this.newClassName.trim(),
      classNumber: this.newClassNumber!,
      subjectList: this.newSubjectList.trim()
    };

    this.classesService.updateClass(this.editingClass.classId, updatedClass).subscribe({
      next: (response: any) => {
        alert('✓ Class updated successfully!');
        this.resetForm();
        this.showEditForm = false;
        this.loadClasses();
      },
      error: (err: any) => {
        const errorMsg = err.error?.message || 'Failed to update class';
        alert('Error: ' + errorMsg);
        console.error('Error updating class:', err);
      }
    });
  }

  // Reactivate deleted class
  reactivateClass(schoolClass: SchoolClass): void {
    const updatedClass: SchoolClass = {
      ...schoolClass,
      isActive: true
    };

    this.classesService.updateClass(schoolClass.classId, updatedClass).subscribe({
      next: (response: any) => {
        alert('✓ Class reactivated successfully!');
        this.loadClasses();
      },
      error: (err: any) => {
        const errorMsg = err.error?.message || 'Failed to reactivate class';
        alert('Error: ' + errorMsg);
        console.error('Error reactivating class:', err);
      }
    });
  }

  // Filter classes based on search and class number
  filterClasses(): void {
    this.filteredClasses = this.classes.filter(c => {
      // Filter by active/inactive status based on toggle
      if (!this.showDeletedClasses && c.isActive === false) {
        return false;
      }

      const matchesSearch = !this.searchTerm || 
        c.className.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesClass = !this.selectedClass || c.classNumber.toString() === this.selectedClass;
      
      return matchesSearch && matchesClass;
    });
    // Update the dataSource data instead of reassigning to trigger change detection
    this.dataSource.data = this.filteredClasses;
  }

  toggleShowDeletedClasses(): void {
    this.showDeletedClasses = !this.showDeletedClasses;
    this.filterClasses();
  }

  // Reset form
  resetForm(): void {
    this.newClassName = '';
    this.newClassNumber = null;
    this.newSubjectList = '';
    this.selectedSubjectIds = [];
    this.editingClass = null;
    this.showSubjectSelector = false;
  }

  // Save (add or update)
  save(): void {
    if (this.editingClass) {
      this.updateClass();
    } else {
      this.addClass();
    }
  }

}
