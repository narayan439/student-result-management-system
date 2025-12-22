import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getMarkForSubject',
  standalone: true
})
export class GetMarkForSubjectPipe implements PipeTransform {
  transform(marks: any[], subjectId: number): any {
    if (!marks || !Array.isArray(marks)) {
      return null;
    }
    
    const found = marks.find(m => m.subjectId === subjectId);
    return found || null;
  }
}
