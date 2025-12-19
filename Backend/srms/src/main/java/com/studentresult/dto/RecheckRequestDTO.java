package com.studentresult.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecheckRequestDTO {
    private Long recheckId;
    private Long studentId;
    private String subject;
    private String reason;
    private String status;
    private Integer oldMarks;
    private Integer newMarks;
    private String adminComments;
}
