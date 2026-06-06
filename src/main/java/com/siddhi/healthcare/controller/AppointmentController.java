package com.siddhi.healthcare.controller;

import com.siddhi.healthcare.model.Appointment;
import com.siddhi.healthcare.model.AppointmentStatus;
import com.siddhi.healthcare.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class AppointmentController {

    @Autowired
    private AppointmentRepository repository;

    @PostMapping("/appointments")
    public ResponseEntity<Map<String, String>> bookAppointment(@RequestBody Appointment appointment) {
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

        repository.bookAppointment(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Appointment booked"));
    }

    @GetMapping("/appointments")
    public List<Appointment> getAppointments() {
        return repository.getAppointments();
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

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<Map<String, String>> deleteAppointment(@PathVariable int id) {
        if (repository.findById(id) == null) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteAppointment(id);
        return ResponseEntity.ok(Map.of("message", "Appointment deleted successfully"));
    }
}
