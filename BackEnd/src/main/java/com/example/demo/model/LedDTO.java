package com.example.demo.model;

import java.time.LocalDateTime;

public class LedDTO {
    private Long id;
    private String deviceName;
    private String active;
    private LocalDateTime timestamp;

    public Long getId() {
        return id;
    }

    public String getActive() {
        return active;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public LedDTO setId(Long id) {
        this.id = id;
        return this;
    }

    public void setActive(String active) {
        this.active = active;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public LedDTO setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
        return this;
    }
}
