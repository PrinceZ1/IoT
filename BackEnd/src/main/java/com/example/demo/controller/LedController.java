package com.example.demo.controller;

import com.example.demo.model.LedDTO;
import com.example.demo.service.LedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class LedController {

    @Autowired
    private LedService ledService;

    @GetMapping("/led")
    public ResponseEntity<Map<String, Object>> getLed(@RequestParam Map<String, Object> params){
        Map<String, Object> result = ledService.getLed(params);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/led/status")
    public ResponseEntity<Map<String, String>> getDeviceStatuses() {
        Map<String, String> statuses = ledService.getCurrentDeviceStatuses();
        return ResponseEntity.ok(statuses);
    }

    @PostMapping("/led/control")
    public ResponseEntity<String> ledControl(@RequestBody LedDTO ledDTO){
        try {
            ledService.controlLed(ledDTO.getDeviceName(), ledDTO.getActive());
            return ResponseEntity.ok("Điều khiển thành công: " + ledDTO.getDeviceName() + " - " + ledDTO.getActive());
        } catch (Exception e) {
            return new ResponseEntity<>("Điều khiển LED không thành công. Lỗi: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
