-- Run this against the healthcare database before starting the updated backend.
USE healthcare;

ALTER TABLE appointment
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
    AFTER appointment_date;

UPDATE appointment
SET status = 'PENDING'
WHERE status IS NULL OR status = '';
