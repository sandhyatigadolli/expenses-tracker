package com.expensetracker.backend.controller;

import com.expensetracker.backend.model.User;
import com.expensetracker.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.expensetracker.backend.security.JwtUtil;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> payload) {

        String fullName = payload.get("fullName");
        String email = payload.get("email");
        String phone = payload.get("phone");
        String password = payload.get("password");

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(409)
                    .body(Map.of("message", "Email already registered"));
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhone(phone);
      user.setPassword(passwordEncoder.encode(password));

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Signup successful"));
    }

   @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody User loginUser,
                               HttpSession session) {

    Optional<User> userOptional =
            userRepository.findByEmail(loginUser.getEmail());

    if (userOptional.isPresent()) {

        User user = userOptional.get();

        if (passwordEncoder.matches(
                loginUser.getPassword(),
                user.getPassword())) {

            session.setAttribute(
                    "LOGGED_IN_USER_ID",
                    user.getId());

            String token =
                    JwtUtil.generateToken(
                            user.getEmail());

            Map<String, Object> response =
                    new HashMap<>();

            response.put("token", token);
            response.put("user", user);

            return ResponseEntity.ok(response);
        }
    }

    return ResponseEntity.status(401)
            .body(Map.of("message",
                    "Invalid credentials"));
}


    @GetMapping("/profile/me")
    public ResponseEntity<?> getMyProfile(HttpSession session) {

        Long userId = (Long) session.getAttribute("LOGGED_IN_USER_ID");

        if (userId == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Not logged in"));
        }

        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok(Map.of(
                        "fullName", user.getFullName(),
                        "email", user.getEmail(),
                        "phone", user.getPhone()
                )))
                .orElse(ResponseEntity.status(404)
                        .body(Map.of("message", "User not found")));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    @PostMapping("/reset-password")
public ResponseEntity<?> resetPassword(
        @RequestBody Map<String, String> payload) {

    String email = payload.get("email");
    String newPassword = payload.get("newPassword");

    Optional<User> userOptional =
            userRepository.findByEmail(email);

    if (userOptional.isEmpty()) {

        return ResponseEntity.status(404)
                .body(Map.of(
                        "message",
                        "Email not found"
                ));
    }

    User user = userOptional.get();

    user.setPassword(
            passwordEncoder.encode(newPassword)
    );

    userRepository.save(user);

    return ResponseEntity.ok(
            Map.of(
                    "message",
                    "Password updated successfully"
            )
    );
}
}
