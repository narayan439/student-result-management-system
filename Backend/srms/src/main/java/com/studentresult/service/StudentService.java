package com.studentresult.service;

import com.studentresult.dto.StudentDTO;
import com.studentresult.entity.Student;
import com.studentresult.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<StudentDTO> getActiveStudents() {
        return studentRepository.findByIsActiveTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<StudentDTO> getStudentById(Long id) {
        return studentRepository.findById(id)
                .map(this::convertToDTO);
    }

    public Optional<StudentDTO> getStudentByEmail(String email) {
        return studentRepository.findByEmail(email)
                .map(this::convertToDTO);
    }

    public Optional<StudentDTO> getStudentByRollNo(String rollNo) {
        return studentRepository.findByRollNo(rollNo)
                .map(this::convertToDTO);
    }

    public List<StudentDTO> getStudentsByClass(String className) {
        return studentRepository.findByClassName(className)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public StudentDTO createStudent(StudentDTO studentDTO) {
        if (studentRepository.findByEmail(studentDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists: " + studentDTO.getEmail());
        }

        if (studentRepository.findByRollNo(studentDTO.getRollNo()).isPresent()) {
            throw new RuntimeException("Roll number already exists: " + studentDTO.getRollNo());
        }

        Student student = new Student();
        student.setName(studentDTO.getName());
        student.setEmail(studentDTO.getEmail());
        student.setRollNo(studentDTO.getRollNo());
        student.setClassName(studentDTO.getClassName());
        student.setDateOfBirth(studentDTO.getDateOfBirth());
        student.setPhone(studentDTO.getPhone());
        student.setAddress(studentDTO.getAddress());
        student.setIsActive(true);

        Student savedStudent = studentRepository.save(student);
        return convertToDTO(savedStudent);
    }

    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));

        student.setName(studentDTO.getName());
        student.setPhone(studentDTO.getPhone());
        student.setAddress(studentDTO.getAddress());
        student.setIsActive(studentDTO.getIsActive());

        Student updatedStudent = studentRepository.save(student);
        return convertToDTO(updatedStudent);
    }

    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));
        student.setIsActive(false);
        studentRepository.save(student);
    }

    private StudentDTO convertToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setStudentId(student.getStudentId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setRollNo(student.getRollNo());
        dto.setClassName(student.getClassName());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setPhone(student.getPhone());
        dto.setAddress(student.getAddress());
        dto.setIsActive(student.getIsActive());
        return dto;
    }
}
