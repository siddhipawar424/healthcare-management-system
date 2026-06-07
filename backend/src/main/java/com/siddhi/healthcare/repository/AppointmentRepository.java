package com.siddhi.healthcare.repository;

import com.siddhi.healthcare.model.Appointment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AppointmentRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int bookAppointment(Appointment appointment) {
        String sql = """
                INSERT INTO appointment(patient_name, doctor_id, appointment_date, status)
                VALUES(?, ?, ?, ?)
                """;

        String status = appointment.getStatus() != null ? appointment.getStatus() : "PENDING";

        return jdbcTemplate.update(
                sql,
                appointment.getPatientName(),
                appointment.getDoctorId(),
                appointment.getAppointmentDate(),
                status
        );
    }

    public List<Appointment> getAppointments() {
        String sql = """
                SELECT id, patient_name, doctor_id, appointment_date, status
                FROM appointment
                ORDER BY id DESC
                """;

        return jdbcTemplate.query(sql, this::mapRow);
    }

    public Appointment findById(int id) {
        String sql = """
                SELECT id, patient_name, doctor_id, appointment_date, status
                FROM appointment
                WHERE id = ?
                """;

        List<Appointment> appointments = jdbcTemplate.query(sql, this::mapRow, id);
        return appointments.isEmpty() ? null : appointments.get(0);
    }

    public int updateAppointment(Appointment appointment) {
        String sql = """
                UPDATE appointment
                SET patient_name = ?, doctor_id = ?, appointment_date = ?, status = ?
                WHERE id = ?
                """;

        return jdbcTemplate.update(
                sql,
                appointment.getPatientName(),
                appointment.getDoctorId(),
                appointment.getAppointmentDate(),
                appointment.getStatus(),
                appointment.getId()
        );
    }

    public int updateStatus(int id, String status) {
        String sql = "UPDATE appointment SET status = ? WHERE id = ?";
        return jdbcTemplate.update(sql, status, id);
    }

    public int deleteAppointment(int id) {
        String sql = "DELETE FROM appointment WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    private Appointment mapRow(java.sql.ResultSet rs, int rowNum) throws java.sql.SQLException {
        Appointment appointment = new Appointment();
        appointment.setId(rs.getInt("id"));
        appointment.setPatientName(rs.getString("patient_name"));
        appointment.setDoctorId(rs.getInt("doctor_id"));
        var date = rs.getDate("appointment_date");
        appointment.setAppointmentDate(date != null ? date.toLocalDate() : null);
        String status = rs.getString("status");
        appointment.setStatus(status != null ? status : "PENDING");
        return appointment;
    }
}
