package com.siddhi.healthcare.controller;

import com.siddhi.healthcare.model.Appointment;
import com.siddhi.healthcare.model.AppointmentStatus;
import com.siddhi.healthcare.model.User;
import com.siddhi.healthcare.repository.AppointmentRepository;
import com.siddhi.healthcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AppointmentController {

    @Autowired
    private AppointmentRepository repository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/appointments")
    public ResponseEntity<Map<String, String>> bookAppointment(
            @RequestBody Appointment appointment,
            Authentication authentication) {
        if (appointment.getPatientName() == null || appointment.getPatientName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Patient name is required"));
        }
        if (appointment.getDoctorId() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Valid doctor is required"));
        }
        if (appointment.getAppointmentDate() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Appointment date is required"));
        }

        if (appointment.getStatus() == null || appointment.getStatus().isBlank()) {
            appointment.setStatus("PENDING");
        }

        // Link appointment to authenticated user
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email);
            if (user != null) {
                appointment.setUserId(user.getId());
            }
        }

        repository.bookAppointment(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Appointment booked"));
    }

    @GetMapping("/appointments")
    public List<Appointment> getAppointments() {
        return repository.getAppointments();
    }

    @GetMapping("/appointments/my")
    public ResponseEntity<?> getMyAppointments(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Not authenticated"));
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }

        return ResponseEntity.ok(repository.getAppointmentsByUserId(user.getId()));
    }

    @GetMapping("/appointments/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable int id) {
        Appointment appointment = repository.findById(id);
        if (appointment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(appointment);
    }

    @PutMapping("/appointments/{id}")
    public ResponseEntity<Map<String, String>> updateAppointment(
            @PathVariable int id,
            @RequestBody Appointment appointment) {

        if (repository.findById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        if (appointment.getPatientName() == null || appointment.getPatientName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Patient name is required"));
        }
        if (appointment.getDoctorId() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Valid doctor is required"));
        }
        if (appointment.getAppointmentDate() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Appointment date is required"));
        }
        if (appointment.getStatus() != null && !AppointmentStatus.isValid(appointment.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid appointment status"));
        }

        appointment.setId(id);
        if (appointment.getStatus() == null || appointment.getStatus().isBlank()) {
            appointment.setStatus("PENDING");
        } else {
            appointment.setStatus(appointment.getStatus().toUpperCase());
        }

        repository.updateAppointment(appointment);
        return ResponseEntity.ok(Map.of("message", "Appointment updated successfully"));
    }

    @PatchMapping("/appointments/{id}/status")
    public ResponseEntity<Map<String, String>> updateAppointmentStatus(
            @PathVariable int id,
            @RequestBody Map<String, String> body) {

        if (repository.findById(id) == null) {
            return ResponseEntity.notFound().build();
        }

        String status = body.get("status");
        if (!AppointmentStatus.isValid(status)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Status must be PENDING, APPROVED, COMPLETED, or CANCELLED"));
        }

        repository.updateStatus(id, status.toUpperCase());
        return ResponseEntity.ok(Map.of("message", "Appointment status updated"));
    }

    @PatchMapping("/appointments/{id}/cancel")
    public ResponseEntity<Map<String, String>> cancelAppointment(
            @PathVariable int id,
            Authentication authentication) {

        Appointment appointment = repository.findById(id);
        if (appointment == null) {
            return ResponseEntity.notFound().build();
        }

        // Patients can only cancel their own appointments
        if (authentication != null) {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email);
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            if (!isAdmin && (user == null || appointment.getUserId() == null
                    || user.getId() != appointment.getUserId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "You can only cancel your own appointments"));
            }
        }

        if ("CANCELLED".equalsIgnoreCase(appointment.getStatus())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Appointment is already cancelled"));
        }

        repository.updateStatus(id, "CANCELLED");
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled successfully"));
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<Map<String, String>> deleteAppointment(@PathVariable int id) {
        if (repository.findById(id) == null) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteAppointment(id);
        return ResponseEntity.ok(Map.of("message", "Appointment deleted successfully"));
    }
}
