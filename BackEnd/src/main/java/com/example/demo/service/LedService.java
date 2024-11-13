package com.example.demo.service;

import com.example.demo.repository.entity.LedEntity;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface LedService {
    Map<String, Object> getLed(Map<String, Object> params);
    Map<String, String> getCurrentDeviceStatuses();
    ResponseEntity<String> controlLed(String deviceName, String action);
    void saveLedData(LedEntity ledData);
}
