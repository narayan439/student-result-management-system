package com.studentresult.repository;

import com.studentresult.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    Optional<Student> findByRollNo(String rollNo);
    List<Student> findByClassName(String className);
    List<Student> findByIsActiveTrue();
}
