package com.example.demo.service;

import com.example.demo.model.SensorDTO;
import com.example.demo.repository.entity.SensorEntity;

import java.util.List;
import java.util.Map;

public interface SensorService {
    Map<String, Object> getSensor(Map<String, Object> params);
    SensorDTO getLatestSensorData();
    void saveSensorData(SensorEntity sensorData);
}
