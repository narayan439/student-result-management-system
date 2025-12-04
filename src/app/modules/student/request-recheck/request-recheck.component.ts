import { Component } from '@angular/core';

@Component({
  selector: 'app-request-recheck',
  templateUrl: './request-recheck.component.html',
  styleUrls: ['./request-recheck.component.css']
})
export class RequestRecheckComponent {

  subjects = ['Maths', 'Science', 'English', 'History', 'Geography'];
  
  students = [
    { rollNo: '101', name: 'Rahul Sharma', className: '10A' },
    { rollNo: '102', name: 'Priya Patel', className: '10B' },
    { rollNo: '103', name: 'Amit Kumar', className: '9A' },
    { rollNo: '104', name: 'Sneha Singh', className: '9B' },
    { rollNo: '105', name: 'Rohan Verma', className: '11A' },
    { rollNo: '106', name: 'Neha Gupta', className: '11B' },
    { rollNo: '107', name: 'Arun Yadav', className: '12A' },
    { rollNo: '108', name: 'Pooja Mishra', className: '12B' },
    { rollNo: '109', name: 'Vikas Singh', className: '10A' },
    { rollNo: '110', name: 'Anjali Tiwari', className: '10B' }
  ];

  // Add these properties for search and pagination
  searchQuery = '';
  pageSize = 5;
  currentPage = 1;
  totalPages = 1;

  recheck = {
    rollNo: '',
    subject: '',
    reason: ''
  };

  get filteredStudents() {
    if (!this.searchQuery) {
      return this.students;
    }
    return this.students.filter(student =>
      student.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      student.className.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  get paginatedStudents() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredStudents.slice(startIndex, endIndex);
  }

  get totalItems() {
    return this.filteredStudents.length;
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  onSearch() {
    this.currentPage = 1;
    this.updatePagination();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.updatePagination();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  submitRecheck() {
    if (!this.recheck.rollNo) {
      alert('Please select a student from the list below');
      return;
    }
    alert(`Recheck request for ${this.recheck.rollNo} in ${this.recheck.subject} submitted!`);
    this.recheck = { rollNo: '', subject: '', reason: '' };
  }

  selectStudent(rollNo: string) {
    this.recheck.rollNo = rollNo;
    // Scroll to form
    setTimeout(() => {
      const formElement = document.querySelector('.form-container');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}