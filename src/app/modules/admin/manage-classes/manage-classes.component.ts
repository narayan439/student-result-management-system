import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface SchoolClass {
  classId: number;
  className: string;
  classNumber: number;
  section: string;
  isActive: boolean;
}

@Component({
  selector: 'app-manage-classes',
  templateUrl: './manage-classes.component.html',
  styleUrls: ['./manage-classes.component.css']
})
export class ManageClassesComponent implements OnInit {

  displayedColumns: string[] = ['className', 'classNumber', 'section', 'status', 'actions'];
  dataSource!: MatTableDataSource<SchoolClass>;
  
  classes: SchoolClass[] = [];
  filteredClasses: SchoolClass[] = [];
  
  // Form state
  showAddForm = false;
  showEditForm = false;
  editingClass: SchoolClass | null = null;
  
  // Form inputs
  newClassName = '';
  newClassNumber: number | null = null;
  newSection: string = '';
  
  // Filter
  searchTerm = '';
  selectedClass: string = '';
  selectedSection: string = '';
  
  classNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  sections = ['A', 'B', 'C', 'D', 'E'];

  constructor() {
    // Mock data - replace with service call
    this.classes = [
      { classId: 1, className: 'Class 1 - A', classNumber: 1, section: 'A', isActive: true },
      { classId: 2, className: 'Class 1 - B', classNumber: 1, section: 'B', isActive: true },
      { classId: 3, className: 'Class 5 - A', classNumber: 5, section: 'A', isActive: true },
      { classId: 4, className: 'Class 10 - B', classNumber: 10, section: 'B', isActive: true },
      { classId: 5, className: 'Class 6 - C', classNumber: 6, section: 'C', isActive: true }
    ];
    this.dataSource = new MatTableDataSource(this.classes);
  }

  ngOnInit(): void {
    this.filterClasses();
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
      this.newSection = schoolClass.section;
      this.showEditForm = true;
    } else {
      this.showEditForm = false;
      this.resetForm();
    }
  }

  // Add new class
  addClass(): void {
    if (!this.newClassName.trim() || !this.newClassNumber || !this.newSection) {
      alert('Please fill all fields');
      return;
    }

    // Check for duplicate class
    if (this.classes.some(c => c.classNumber === this.newClassNumber && c.section === this.newSection && (!this.editingClass || c.classId !== this.editingClass.classId))) {
      alert('This class and section combination already exists!');
      return;
    }

    const newClass: SchoolClass = {
      classId: this.classes.length > 0 ? Math.max(...this.classes.map(c => c.classId)) + 1 : 1,
      className: this.newClassName.trim(),
      classNumber: this.newClassNumber!,
      section: this.newSection,
      isActive: true
    };

    this.classes.push(newClass);
    this.filterClasses();
    this.resetForm();
    this.showAddForm = false;
    alert('Class added successfully!');
  }

  // Update class
  updateClass(): void {
    if (!this.editingClass) return;

    if (!this.newClassName.trim() || !this.newClassNumber || !this.newSection) {
      alert('Please fill all fields');
      return;
    }

    // Check for duplicate class
    if (this.classes.some(c => c.classNumber === this.newClassNumber && c.section === this.newSection && c.classId !== this.editingClass!.classId)) {
      alert('This class and section combination already exists!');
      return;
    }

    const index = this.classes.findIndex(c => c.classId === this.editingClass!.classId);
    if (index !== -1) {
      this.classes[index] = {
        ...this.editingClass,
        className: this.newClassName.trim(),
        classNumber: this.newClassNumber!,
        section: this.newSection
      };
      this.filterClasses();
      this.resetForm();
      this.showEditForm = false;
      alert('Class updated successfully!');
    }
  }

  // Delete class
  deleteClass(schoolClass: SchoolClass): void {
    if (confirm(`Delete class ${schoolClass.className}?`)) {
      this.classes = this.classes.filter(c => c.classId !== schoolClass.classId);
      this.filterClasses();
      alert('Class deleted successfully!');
    }
  }

  // Toggle active status
  toggleStatus(schoolClass: SchoolClass): void {
    schoolClass.isActive = !schoolClass.isActive;
    this.filterClasses();
  }

  // Filter classes based on search and class number/section
  filterClasses(): void {
    this.filteredClasses = this.classes.filter(c => {
      const matchesSearch = !this.searchTerm || 
        c.className.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesClass = !this.selectedClass || c.classNumber.toString() === this.selectedClass;
      const matchesSection = !this.selectedSection || c.section === this.selectedSection;
      
      return matchesSearch && matchesClass && matchesSection;
    });
    this.dataSource = new MatTableDataSource(this.filteredClasses);
  }

  // Reset form
  resetForm(): void {
    this.newClassName = '';
    this.newClassNumber = null;
    this.newSection = '';
    this.editingClass = null;
  }

  // Save (add or update)
  save(): void {
    if (this.editingClass) {
      this.updateClass();
    } else {
      this.addClass();
    }
  }

  // Get status badge color
  getStatusColor(isActive: boolean): string {
    return isActive ? 'accent' : 'warn';
  }

  // Get status text
  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }
}
