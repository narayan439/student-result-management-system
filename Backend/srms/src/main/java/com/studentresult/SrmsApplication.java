package com.studentresult;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.studentresult")
public class SrmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(SrmsApplication.class, args);
    }
}
