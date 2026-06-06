package com.siddhi.healthcare.repository;

import com.siddhi.healthcare.model.ContactMessage;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ContactRepository {

    private final JdbcTemplate jdbcTemplate;

    public ContactRepository(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public int save(ContactMessage contact){

        String sql = """
        INSERT INTO contact_messages
        (name,email,subject,message)
        VALUES(?,?,?,?)
        """;

        return jdbcTemplate.update(
                sql,
                contact.getName(),
                contact.getEmail(),
                contact.getSubject(),
                contact.getMessage()
        );
    }

    public List<ContactMessage> findAll(){

        String sql =
                "SELECT * FROM contact_messages";

        return jdbcTemplate.query(
                sql,
                (rs,rowNum)->{

                    ContactMessage c =
                            new ContactMessage();

                    c.setId(rs.getInt("id"));
                    c.setName(rs.getString("name"));
                    c.setEmail(rs.getString("email"));
                    c.setSubject(rs.getString("subject"));
                    c.setMessage(rs.getString("message"));

                    return c;
                }
        );
    }

    public ContactMessage findById(int id) {
        String sql = "SELECT * FROM contact_messages WHERE id = ?";
        List<ContactMessage> messages = jdbcTemplate.query(
                sql,
                (rs, rowNum) -> {
                    ContactMessage c = new ContactMessage();
                    c.setId(rs.getInt("id"));
                    c.setName(rs.getString("name"));
                    c.setEmail(rs.getString("email"));
                    c.setSubject(rs.getString("subject"));
                    c.setMessage(rs.getString("message"));
                    return c;
                },
                id
        );
        return messages.isEmpty() ? null : messages.get(0);
    }

    public int deleteById(int id) {
        String sql = "DELETE FROM contact_messages WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}