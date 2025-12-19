package com.studentresult.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "recheck_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecheckRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recheck_id")
    private Long recheckId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "subject", nullable = false)
    private String subject;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "status")
    private String status = "pending"; // pending, approved, rejected, completed

    @Column(name = "old_marks")
    private Integer oldMarks;

    @Column(name = "new_marks")
    private Integer newMarks;

    @Column(name = "admin_comments", columnDefinition = "TEXT")
    private String adminComments;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "pending";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
