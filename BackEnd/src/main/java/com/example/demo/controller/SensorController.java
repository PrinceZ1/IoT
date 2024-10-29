package com.example.demo.controller;

import com.example.demo.model.SensorDTO;
import com.example.demo.service.SensorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class SensorController {
    @Autowired
    private SensorService sensorService;

    @GetMapping("/sensor")
    public ResponseEntity<Map<String, Object>> getSensor(@RequestParam Map<String, Object> params) {
        Map<String, Object> result = sensorService.getSensor(params);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/sensor/latest")
    public SensorDTO getLatestSensorData() {
        return sensorService.getLatestSensorData();
    }

}