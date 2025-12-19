package com.studentresult.service;

import com.studentresult.dto.MarksDTO;
import com.studentresult.entity.Marks;
import com.studentresult.entity.Student;
import com.studentresult.repository.MarksRepository;
import com.studentresult.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MarksService {

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<MarksDTO> getAllMarks() {
        return marksRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MarksDTO> getMarksByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return marksRepository.findByStudent(student)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MarksDTO> getMarksBySubject(String subject) {
        return marksRepository.findBySubject(subject)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MarksDTO> getMarksByTerm(String term) {
        return marksRepository.findByTerm(term)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MarksDTO createMarks(MarksDTO marksDTO) {
        Student student = studentRepository.findById(marksDTO.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Marks marks = new Marks();
        marks.setStudent(student);
        marks.setSubject(marksDTO.getSubject());
        marks.setMarksObtained(marksDTO.getMarksObtained());
        marks.setMaxMarks(marksDTO.getMaxMarks());
        marks.setTerm(marksDTO.getTerm());
        marks.setYear(marksDTO.getYear());

        Marks savedMarks = marksRepository.save(marks);
        return convertToDTO(savedMarks);
    }

    public MarksDTO updateMarks(Long id, MarksDTO marksDTO) {
        Marks marks = marksRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marks not found"));

        marks.setMarksObtained(marksDTO.getMarksObtained());
        marks.setMaxMarks(marksDTO.getMaxMarks());
        marks.setTerm(marksDTO.getTerm());
        marks.setYear(marksDTO.getYear());

        Marks updatedMarks = marksRepository.save(marks);
        return convertToDTO(updatedMarks);
    }

    public void deleteMarks(Long id) {
        marksRepository.deleteById(id);
    }

    private MarksDTO convertToDTO(Marks marks) {
        MarksDTO dto = new MarksDTO();
        dto.setMarksId(marks.getMarksId());
        dto.setStudentId(marks.getStudent().getStudentId());
        dto.setSubject(marks.getSubject());
        dto.setMarksObtained(marks.getMarksObtained());
        dto.setMaxMarks(marks.getMaxMarks());
        dto.setTerm(marks.getTerm());
        dto.setYear(marks.getYear());
        return dto;
    }
}
