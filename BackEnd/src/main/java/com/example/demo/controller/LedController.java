package com.example.demo.controller;

import com.example.demo.model.LedDTO;
import com.example.demo.service.LedService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
