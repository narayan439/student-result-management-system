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
  
  private classesSubject = new BehaviorSubject<SchoolClass[]>(this.generateAllClasses());

  classes$ = this.classesSubject.asObservable();

  constructor() {}

  // Generate all classes (1-10) with all sections (A-E) = 50 classes
  private generateAllClasses(): SchoolClass[] {
    const classes: SchoolClass[] = [];
    let classId = 1;

    for (let classNum = 1; classNum <= 10; classNum++) {
      for (const section of ['A', 'B', 'C', 'D', 'E']) {
        classes.push({
          classId,
          className: `Class ${classNum} - ${section}`,
          classNumber: classNum,
          section,
          isActive: true
        });
        classId++;
      }
    }

    return classes;
  }

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
