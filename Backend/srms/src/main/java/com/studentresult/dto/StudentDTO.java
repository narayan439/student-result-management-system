package com.studentresult.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private Long studentId;
    private String name;
    private String email;
    private String rollNo;
    private String className;
    private String dateOfBirth; // DD/MM/YYYY format
    private String phone;
    private String address;
    private Boolean isActive;
}
