package com.siddhi.healthcare.model;

public enum AppointmentStatus {
    PENDING,
    APPROVED,
    COMPLETED,
    CANCELLED;

    public static boolean isValid(String value) {
        if (value == null || value.isBlank()) {
            return false;
        }
        try {
            AppointmentStatus.valueOf(value.toUpperCase());
            return true;
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }
}
