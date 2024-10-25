package com.example.demo.model;

import java.time.LocalDateTime;

public class SensorDTO {
    private Long id;
    private Integer temperature;
    private Integer humidity;
    private Integer light;
    private LocalDateTime timestamp;

    public Long getId() {
        return id;
    }

    public Integer getHumidity() {
        return humidity;
    }

    public Integer getLight() {
        return light;
    }

    public Integer getTemperature() {
        return temperature;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public SensorDTO setId(Long id) {
        this.id = id;
        return this;
    }

    public SensorDTO setHumidity(Integer humidity) {
        this.humidity = humidity;
        return this;
    }

    public SensorDTO setLight(Integer light) {
        this.light = light;
        return this;
    }

    public SensorDTO setTemperature(Integer temperature) {
        this.temperature = temperature;
        return this;
    }

    public SensorDTO setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
        return this;
    }
}
