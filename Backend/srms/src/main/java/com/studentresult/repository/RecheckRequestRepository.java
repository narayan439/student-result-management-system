package com.studentresult.repository;

import com.studentresult.entity.RecheckRequest;
import com.studentresult.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecheckRequestRepository extends JpaRepository<RecheckRequest, Long> {
    List<RecheckRequest> findByStudent(Student student);
    List<RecheckRequest> findByStatus(String status);
    List<RecheckRequest> findByStudentAndStatus(Student student, String status);
}
