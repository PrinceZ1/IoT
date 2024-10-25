package com.example.demo.service;

import com.example.demo.model.LedDTO;
import com.example.demo.repository.entity.LedEntity;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface LedService {
    Map<String, Object> getLed(Map<String, Object> params);
    ResponseEntity<String> controlLed(String deviceName, String action);
    void saveLedData(LedEntity ledData);
}
