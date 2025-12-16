import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SchoolClass {
  classId: number;
  className: string;
  classNumber: number;
  section: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  
  private classesSubject = new BehaviorSubject<SchoolClass[]>([
    { classId: 1, className: 'Class 1 - A', classNumber: 1, section: 'A', isActive: true },
    { classId: 2, className: 'Class 1 - B', classNumber: 1, section: 'B', isActive: true },
    { classId: 3, className: 'Class 5 - A', classNumber: 5, section: 'A', isActive: true },
    { classId: 4, className: 'Class 10 - B', classNumber: 10, section: 'B', isActive: true },
    { classId: 5, className: 'Class 6 - C', classNumber: 6, section: 'C', isActive: true }
  ]);

  classes$ = this.classesSubject.asObservable();

  constructor() {}

  // Get all classes
  getClasses(): Observable<SchoolClass[]> {
    return this.classes$;
  }

  // Get classes as array (synchronous)
  getClassesArray(): SchoolClass[] {
    return this.classesSubject.value;
  }

  // Add a new class
  addClass(schoolClass: SchoolClass): void {
    const currentClasses = this.classesSubject.value;
    const newClasses = [...currentClasses, schoolClass];
    this.classesSubject.next(newClasses);
  }

  // Update a class
  updateClass(updatedClass: SchoolClass): void {
    const currentClasses = this.classesSubject.value;
    const newClasses = currentClasses.map(c => 
      c.classId === updatedClass.classId ? updatedClass : c
    );
    this.classesSubject.next(newClasses);
  }

  // Delete a class
  deleteClass(classId: number): void {
    const currentClasses = this.classesSubject.value;
    const newClasses = currentClasses.filter(c => c.classId !== classId);
    this.classesSubject.next(newClasses);
  }

  // Set all classes
  setClasses(classes: SchoolClass[]): void {
    this.classesSubject.next(classes);
  }
}
