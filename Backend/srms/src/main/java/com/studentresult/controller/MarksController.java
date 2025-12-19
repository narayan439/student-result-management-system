package com.studentresult.controller;

import com.studentresult.dto.ApiResponse;
import com.studentresult.dto.MarksDTO;
import com.studentresult.service.MarksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000"})
public class MarksController {

    @Autowired
    private MarksService marksService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<MarksDTO>>> getAllMarks() {
        try {
            List<MarksDTO> marks = marksService.getAllMarks();
            return ResponseEntity.ok(ApiResponse.success("Marks retrieved successfully", marks));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve marks", e.getMessage()));
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<MarksDTO>>> getMarksByStudent(@PathVariable Long studentId) {
        try {
            List<MarksDTO> marks = marksService.getMarksByStudent(studentId);
            return ResponseEntity.ok(ApiResponse.success("Marks retrieved successfully", marks));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve marks", e.getMessage()));
        }
    }

    @GetMapping("/subject/{subject}")
    public ResponseEntity<ApiResponse<List<MarksDTO>>> getMarksBySubject(@PathVariable String subject) {
        try {
            List<MarksDTO> marks = marksService.getMarksBySubject(subject);
            return ResponseEntity.ok(ApiResponse.success("Marks retrieved successfully", marks));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve marks", e.getMessage()));
        }
    }

    @GetMapping("/term/{term}")
    public ResponseEntity<ApiResponse<List<MarksDTO>>> getMarksByTerm(@PathVariable String term) {
        try {
            List<MarksDTO> marks = marksService.getMarksByTerm(term);
            return ResponseEntity.ok(ApiResponse.success("Marks retrieved successfully", marks));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve marks", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MarksDTO>> createMarks(@RequestBody MarksDTO marksDTO) {
        try {
            MarksDTO createdMarks = marksService.createMarks(marksDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Marks created successfully", createdMarks));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to create marks", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MarksDTO>> updateMarks(@PathVariable Long id, @RequestBody MarksDTO marksDTO) {
        try {
            MarksDTO updatedMarks = marksService.updateMarks(id, marksDTO);
            return ResponseEntity.ok(ApiResponse.success("Marks updated successfully", updatedMarks));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to update marks", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMarks(@PathVariable Long id) {
        try {
            marksService.deleteMarks(id);
            return ResponseEntity.ok(ApiResponse.success("Marks deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to delete marks", e.getMessage()));
        }
    }
}
