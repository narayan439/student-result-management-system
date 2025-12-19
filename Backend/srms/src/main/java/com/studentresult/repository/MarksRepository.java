package com.studentresult.repository;

import com.studentresult.entity.Marks;
import com.studentresult.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Long> {
    List<Marks> findByStudent(Student student);
    List<Marks> findByStudentAndSubject(Student student, String subject);
    List<Marks> findBySubject(String subject);
    List<Marks> findByTerm(String term);
}
