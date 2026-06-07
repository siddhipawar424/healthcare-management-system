package com.siddhi.healthcare.service;

import com.siddhi.healthcare.model.ContactMessage;
import com.siddhi.healthcare.repository.ContactRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository){
        this.contactRepository = contactRepository;
    }

    public void save(ContactMessage contact){
        contactRepository.save(contact);
    }

    public List<ContactMessage> getAll(){
        return contactRepository.findAll();
    }

    public boolean deleteContact(int id) {
        if (contactRepository.findById(id) == null) {
            return false;
        }
        contactRepository.deleteById(id);
        return true;
    }
}