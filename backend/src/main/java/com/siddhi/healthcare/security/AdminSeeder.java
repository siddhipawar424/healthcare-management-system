package com.siddhi.healthcare.security;

import com.siddhi.healthcare.model.User;
import com.siddhi.healthcare.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String adminEmail = "admin@healthcare.com";

        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User(
                    "Administrator",
                    adminEmail,
                    passwordEncoder.encode("admin123"),
                    "ADMIN"
            );
            userRepository.save(admin);
            System.out.println("✅ Default admin account created: " + adminEmail);
        } else {
            System.out.println("ℹ️  Admin account already exists: " + adminEmail);
        }
    }
}
