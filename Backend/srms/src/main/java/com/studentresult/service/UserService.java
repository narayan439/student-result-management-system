package com.studentresult.service;

import com.studentresult.entity.User;
import com.studentresult.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Authenticate user with email and password
     * @param email User email
     * @param password User password
     * @return User if credentials are valid
     */
    public Optional<User> authenticateUser(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    /**
     * Get user by email
     * @param email User email
     * @return User if found
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Get user by ID
     * @param userId User ID
     * @return User if found
     */
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    /**
     * Get all users
     * @return List of all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Get all active users
     * @return List of active users
     */
    public List<User> getActiveUsers() {
        return userRepository.findAll().stream()
                .filter(User::getIsActive)
                .toList();
    }

    /**
     * Create new user
     * @param user User to create
     * @return Created user
     */
    public User createUser(User user) {
        if (user.getIsActive() == null) {
            user.setIsActive(true);
        }
        return userRepository.save(user);
    }

    /**
     * Update user
     * @param user User to update
     * @return Updated user
     */
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Delete user (soft delete)
     * @param userId User ID to delete
     */
    public void deleteUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User u = user.get();
            u.setIsActive(false);
            userRepository.save(u);
        }
    }

    /**
     * Check if user exists by email
     * @param email User email
     * @return true if user exists
     */
    public boolean userExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    /**
     * Get users by role
     * @param role User role (admin, teacher, student)
     * @return List of users with given role
     */
    public List<User> getUsersByRole(String role) {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole().equalsIgnoreCase(role) && u.getIsActive())
                .toList();
    }
}
