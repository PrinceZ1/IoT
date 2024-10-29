package com.example.demo.model;

import java.time.LocalDateTime;

public class SensorDTO {
    private Long id;
    private Integer temperature;
    private Integer humidity;
    private Integer light;
    private Integer wind;
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

    public Integer getWind() {
        return wind;
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

    public void setWind(Integer wind) {
        this.wind = wind;
    }

    public SensorDTO setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
        return this;
    }
}
