package com.siddhi.healthcare.repository;

import com.siddhi.healthcare.model.Doctor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DoctorRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Doctor> getAllDoctors() {

        String sql = "select * from doctor";

        return jdbcTemplate.query(
                sql,
                new BeanPropertyRowMapper<>(Doctor.class)
        );
    }

    public int addDoctor(Doctor doctor) {

        String sql =
                "insert into doctor(name,specialization,fees) values(?,?,?)";

        return jdbcTemplate.update(
                sql,
                doctor.getName(),
                doctor.getSpecialization(),
                doctor.getFees()
        );
    }

    public Doctor findById(int id) {
        String sql = "select * from doctor where id = ?";
        List<Doctor> doctors = jdbcTemplate.query(
                sql,
                new BeanPropertyRowMapper<>(Doctor.class),
                id
        );
        return doctors.isEmpty() ? null : doctors.get(0);
    }

    public int updateDoctor(Doctor doctor) {
        String sql = "update doctor set name = ?, specialization = ?, fees = ? where id = ?";
        return jdbcTemplate.update(
                sql,
                doctor.getName(),
                doctor.getSpecialization(),
                doctor.getFees(),
                doctor.getId()
        );
    }

    public int deleteDoctor(int id) {
        String sql = "delete from doctor where id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int countAppointmentsByDoctorId(int doctorId) {
        String sql = "select count(*) from appointment where doctor_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, doctorId);
        return count != null ? count : 0;
    }
}
