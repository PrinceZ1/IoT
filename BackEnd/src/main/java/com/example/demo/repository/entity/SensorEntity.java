package com.example.demo.repository.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name="sensordata")
public class SensorEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "temperature")
    private Integer temperature;

    @Column(name = "humidity")
    private Integer humidity;

    @Column(name = "light")
    private Integer light;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    public Integer getHumidity() {
        return humidity;
    }

    public Long getId() {
        return id;
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

    public void setHumidity(Integer humidity) {
        this.humidity = humidity;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setLight(Integer light) {
        this.light = light;
    }

    public void setTemperature(Integer temperature) {
        this.temperature = temperature;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
