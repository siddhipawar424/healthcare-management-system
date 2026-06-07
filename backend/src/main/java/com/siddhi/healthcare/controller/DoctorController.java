package com.siddhi.healthcare.controller;

import com.siddhi.healthcare.model.Doctor;
import com.siddhi.healthcare.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class DoctorController {

    @Autowired
    private DoctorRepository repository;

    @GetMapping("/doctors")
    public List<Doctor> getDoctors() {
        return repository.getAllDoctors();
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable int id) {
        Doctor doctor = repository.findById(id);
        if (doctor == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(doctor);
    }

    @PostMapping("/doctors")
    public ResponseEntity<Map<String, String>> addDoctor(@RequestBody Doctor doctor) {
        if (doctor.getName() == null || doctor.getName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Doctor name is required"));
        }
        repository.addDoctor(doctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Doctor added successfully"));
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<Map<String, String>> updateDoctor(
            @PathVariable int id,
            @RequestBody Doctor doctor) {

        if (repository.findById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        if (doctor.getName() == null || doctor.getName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Doctor name is required"));
        }

        doctor.setId(id);
        repository.updateDoctor(doctor);
        return ResponseEntity.ok(Map.of("message", "Doctor updated successfully"));
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<Map<String, String>> deleteDoctor(@PathVariable int id) {
        if (repository.findById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        if (repository.countAppointmentsByDoctorId(id) > 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Cannot delete doctor with existing appointments"));
        }

        repository.deleteDoctor(id);
        return ResponseEntity.ok(Map.of("message", "Doctor deleted successfully"));
    }
}
