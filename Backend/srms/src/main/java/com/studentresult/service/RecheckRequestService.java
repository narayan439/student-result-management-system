package com.studentresult.service;

import com.studentresult.dto.RecheckRequestDTO;
import com.studentresult.entity.RecheckRequest;
import com.studentresult.entity.Student;
import com.studentresult.repository.RecheckRequestRepository;
import com.studentresult.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RecheckRequestService {

    @Autowired
    private RecheckRequestRepository recheckRequestRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<RecheckRequestDTO> getAllRecheckRequests() {
        return recheckRequestRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<RecheckRequestDTO> getRecheckRequestsByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return recheckRequestRepository.findByStudent(student)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<RecheckRequestDTO> getRecheckRequestsByStatus(String status) {
        return recheckRequestRepository.findByStatus(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RecheckRequestDTO createRecheckRequest(RecheckRequestDTO recheckDTO) {
        Student student = studentRepository.findById(recheckDTO.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        RecheckRequest recheck = new RecheckRequest();
        recheck.setStudent(student);
        recheck.setSubject(recheckDTO.getSubject());
        recheck.setReason(recheckDTO.getReason());
        recheck.setStatus("pending");

        RecheckRequest savedRecheck = recheckRequestRepository.save(recheck);
        return convertToDTO(savedRecheck);
    }

    public RecheckRequestDTO updateRecheckRequest(Long id, RecheckRequestDTO recheckDTO) {
        RecheckRequest recheck = recheckRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recheck request not found"));

        recheck.setStatus(recheckDTO.getStatus());
        recheck.setOldMarks(recheckDTO.getOldMarks());
        recheck.setNewMarks(recheckDTO.getNewMarks());
        recheck.setAdminComments(recheckDTO.getAdminComments());

        RecheckRequest updatedRecheck = recheckRequestRepository.save(recheck);
        return convertToDTO(updatedRecheck);
    }

    public void deleteRecheckRequest(Long id) {
        recheckRequestRepository.deleteById(id);
    }

    private RecheckRequestDTO convertToDTO(RecheckRequest recheck) {
        RecheckRequestDTO dto = new RecheckRequestDTO();
        dto.setRecheckId(recheck.getRecheckId());
        dto.setStudentId(recheck.getStudent().getStudentId());
        dto.setSubject(recheck.getSubject());
        dto.setReason(recheck.getReason());
        dto.setStatus(recheck.getStatus());
        dto.setOldMarks(recheck.getOldMarks());
        dto.setNewMarks(recheck.getNewMarks());
        dto.setAdminComments(recheck.getAdminComments());
        return dto;
    }
}
