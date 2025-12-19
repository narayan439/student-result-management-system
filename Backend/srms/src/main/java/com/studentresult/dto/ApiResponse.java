package com.studentresult.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private int status;
    private String message;
    private T data;
    private String error;

    public static <T> ApiResponse<T> success(String message, T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.status = 200;
        response.message = message;
        response.data = data;
        return response;
    }

    public static <T> ApiResponse<T> error(String message, String error) {
        ApiResponse<T> response = new ApiResponse<>();
        response.status = 400;
        response.message = message;
        response.error = error;
        return response;
    }

    public static <T> ApiResponse<T> notFound(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.status = 404;
        response.message = message;
        response.error = "Not Found";
        return response;
    }
}
