package com.studentresult.controller;

import com.studentresult.dto.ApiResponse;
import com.studentresult.dto.StudentDTO;
import com.studentresult.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000"})
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<StudentDTO>>> getAllStudents() {
        try {
            List<StudentDTO> students = studentService.getAllStudents();
            return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", students));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve students", e.getMessage()));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<StudentDTO>>> getActiveStudents() {
        try {
            List<StudentDTO> students = studentService.getActiveStudents();
            return ResponseEntity.ok(ApiResponse.success("Active students retrieved successfully", students));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve active students", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentDTO>> getStudentById(@PathVariable Long id) {
        try {
            Optional<StudentDTO> student = studentService.getStudentById(id);
            if (student.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Student retrieved successfully", student.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.notFound("No student found with ID: " + id));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve student", e.getMessage()));
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<StudentDTO>> getStudentByEmail(@PathVariable String email) {
        try {
            Optional<StudentDTO> student = studentService.getStudentByEmail(email);
            if (student.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Student retrieved successfully", student.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.notFound("No student found with email: " + email));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve student", e.getMessage()));
        }
    }

    @GetMapping("/class/{className}")
    public ResponseEntity<ApiResponse<List<StudentDTO>>> getStudentsByClass(@PathVariable String className) {
        try {
            List<StudentDTO> students = studentService.getStudentsByClass(className);
            return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", students));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve students", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StudentDTO>> createStudent(@RequestBody StudentDTO studentDTO) {
        try {
            StudentDTO createdStudent = studentService.createStudent(studentDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Student created successfully", createdStudent));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to create student", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentDTO>> updateStudent(@PathVariable Long id, @RequestBody StudentDTO studentDTO) {
        try {
            StudentDTO updatedStudent = studentService.updateStudent(id, studentDTO);
            return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updatedStudent));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to update student", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to delete student", e.getMessage()));
        }
    }
}
