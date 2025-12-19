package com.studentresult.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarksDTO {
    private Long marksId;
    private Long studentId;
    private String subject;
    private Integer marksObtained;
    private Integer maxMarks;
    private String term;
    private Integer year;
}
