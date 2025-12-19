package com.studentresult.controller;

import com.studentresult.dto.ApiResponse;
import com.studentresult.dto.LoginRequest;
import com.studentresult.dto.LoginResponse;
import com.studentresult.entity.User;
import com.studentresult.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000"})
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * Login endpoint for Student, Teacher, and Admin
     * @param loginRequest Login credentials (email and password)
     * @return Login response with user details and role
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest loginRequest) {
        // Validate request
        if (loginRequest.getEmail() == null || loginRequest.getEmail().isEmpty() ||
            loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Email and password are required"));
        }

        // Authenticate user
        Optional<User> user = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());

        if (user.isPresent()) {
            User loggedInUser = user.get();
            
            // Check if user is active
            if (!loggedInUser.getIsActive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("User account is inactive"));
            }

            // Create login response
            LoginResponse response = new LoginResponse();
            response.setUserId(loggedInUser.getUserId());
            response.setEmail(loggedInUser.getEmail());
            response.setRole(loggedInUser.getRole());
            response.setMessage("Login successful");
            response.setSuccess(true);

            return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid email or password"));
        }
    }

    /**
     * Register new user (Admin only)
     * @param user User details to register
     * @return Created user response
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> registerUser(@RequestBody User user) {
        // Validate request
        if (user.getEmail() == null || user.getEmail().isEmpty() ||
            user.getPassword() == null || user.getPassword().isEmpty() ||
            user.getRole() == null || user.getRole().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Email, password, and role are required"));
        }

        // Check if user already exists
        if (userService.userExists(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("User with this email already exists"));
        }

        // Create user
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdUser, "User registered successfully"));
    }

    /**
     * Logout endpoint (client-side token cleanup)
     * @return Success message
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        return ResponseEntity.ok(ApiResponse.success("", "Logout successful"));
    }

    /**
     * Verify if user is authenticated
     * @param email User email
     * @return User details if found
     */
    @GetMapping("/verify/{email}")
    public ResponseEntity<ApiResponse<User>> verifyUser(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        
        if (user.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success(user.get(), "User verified"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.notFound("User not found"));
        }
    }

    /**
     * Get user details by ID
     * @param userId User ID
     * @return User details
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<User>> getUser(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        
        if (user.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success(user.get(), "User retrieved successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.notFound("User not found"));
        }
    }

    /**
     * Update user details
     * @param userId User ID to update
     * @param user Updated user details
     * @return Updated user
     */
    @PutMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable Long userId, @RequestBody User user) {
        Optional<User> existingUser = userService.getUserById(userId);
        
        if (existingUser.isPresent()) {
            User userToUpdate = existingUser.get();
            
            // Update only specific fields
            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                userToUpdate.setPassword(user.getPassword());
            }
            if (user.getRole() != null) {
                userToUpdate.setRole(user.getRole());
            }
            if (user.getIsActive() != null) {
                userToUpdate.setIsActive(user.getIsActive());
            }
            
            User updatedUser = userService.updateUser(userToUpdate);
            return ResponseEntity.ok(ApiResponse.success(updatedUser, "User updated successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.notFound("User not found"));
        }
    }

    /**
     * Check email availability
     * @param email Email to check
     * @return true if email is available
     */
    @GetMapping("/check-email/{email}")
    public ResponseEntity<ApiResponse<Boolean>> checkEmailAvailability(@PathVariable String email) {
        boolean exists = userService.userExists(email);
        String message = exists ? "Email already registered" : "Email is available";
        return ResponseEntity.ok(ApiResponse.success(!exists, message));
    }
}
