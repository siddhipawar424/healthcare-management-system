package com.siddhi.healthcare.controller;

import com.siddhi.healthcare.model.ContactMessage;
import com.siddhi.healthcare.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:5173")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService){
        this.contactService = contactService;
    }

    @PostMapping
    public void saveContact(
            @RequestBody ContactMessage contact
    ){
        contactService.save(contact);
    }

    @GetMapping
    public List<ContactMessage> getAllContacts(){
        return contactService.getAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteContact(@PathVariable int id) {
        if (!contactService.deleteContact(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("message", "Contact message deleted successfully"));
    }
}