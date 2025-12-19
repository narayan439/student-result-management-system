package com.studentresult.controller;

import com.studentresult.dto.ApiResponse;
import com.studentresult.dto.RecheckRequestDTO;
import com.studentresult.service.RecheckRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recheck-requests")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000"})
public class RecheckRequestController {

    @Autowired
    private RecheckRequestService recheckRequestService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<RecheckRequestDTO>>> getAllRecheckRequests() {
        try {
            List<RecheckRequestDTO> requests = recheckRequestService.getAllRecheckRequests();
            return ResponseEntity.ok(ApiResponse.success("Recheck requests retrieved successfully", requests));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve recheck requests", e.getMessage()));
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<RecheckRequestDTO>>> getRecheckRequestsByStudent(@PathVariable Long studentId) {
        try {
            List<RecheckRequestDTO> requests = recheckRequestService.getRecheckRequestsByStudent(studentId);
            return ResponseEntity.ok(ApiResponse.success("Recheck requests retrieved successfully", requests));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve recheck requests", e.getMessage()));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<RecheckRequestDTO>>> getRecheckRequestsByStatus(@PathVariable String status) {
        try {
            List<RecheckRequestDTO> requests = recheckRequestService.getRecheckRequestsByStatus(status);
            return ResponseEntity.ok(ApiResponse.success("Recheck requests retrieved successfully", requests));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve recheck requests", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RecheckRequestDTO>> createRecheckRequest(@RequestBody RecheckRequestDTO recheckDTO) {
        try {
            RecheckRequestDTO createdRequest = recheckRequestService.createRecheckRequest(recheckDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Recheck request created successfully", createdRequest));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to create recheck request", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RecheckRequestDTO>> updateRecheckRequest(@PathVariable Long id, @RequestBody RecheckRequestDTO recheckDTO) {
        try {
            RecheckRequestDTO updatedRequest = recheckRequestService.updateRecheckRequest(id, recheckDTO);
            return ResponseEntity.ok(ApiResponse.success("Recheck request updated successfully", updatedRequest));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to update recheck request", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRecheckRequest(@PathVariable Long id) {
        try {
            recheckRequestService.deleteRecheckRequest(id);
            return ResponseEntity.ok(ApiResponse.success("Recheck request deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to delete recheck request", e.getMessage()));
        }
    }
}
