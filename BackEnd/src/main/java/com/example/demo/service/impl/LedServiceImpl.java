package com.example.demo.service.impl;


import com.example.demo.converter.LedDTOConverter;
import com.example.demo.model.LedDTO;
import com.example.demo.repository.LedRepository;
import com.example.demo.repository.entity.LedEntity;
import com.example.demo.service.LedService;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LedServiceImpl implements LedService {

    @Autowired
    private LedRepository ledRepository;

    @Autowired
    private LedDTOConverter ledDTOConverter;

    @Autowired
    private MqttClient mqttClient;

    @Override
    public Map<String, Object> getLed(Map<String, Object> params) {
        String deviceName = params.containsKey("deviceName") ? params.get("deviceName").toString() : null;
        String active = params.containsKey("active") ? params.get("active").toString() : null;

        Integer year = null;
        Integer month = null;
        Integer day = null;
        Integer hour = null;
        Integer minute = null;

        // Kiểm tra và xử lý tham số timestamp
        if (params.containsKey("timestamp")) {
            String timestampParam = params.get("timestamp").toString();

            // Nếu chỉ chứa ngày tháng năm (yyyy-MM-dd)
            if (timestampParam.matches("\\d{4}-\\d{2}-\\d{2}")) {
                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                LocalDate date = LocalDate.parse(timestampParam, dateFormatter);
                year = date.getYear();
                month = date.getMonthValue();
                day = date.getDayOfMonth();
            }

            // Nếu chỉ chứa giờ và phút (HH:mm)
            if (timestampParam.matches("\\d{2}:\\d{2}")) {
                DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
                LocalTime time = LocalTime.parse(timestampParam, timeFormatter);
                hour = time.getHour();
                minute = time.getMinute();
            }
        }

        // Lấy pageSize và pageNumber từ params
        int pageSize = params.containsKey("pageSize") ? Integer.parseInt(params.get("pageSize").toString()) : 10;
        int pageNumber = params.containsKey("pageNumber") ? Integer.parseInt(params.get("pageNumber").toString()) : 0;

        // Xử lý sắp xếp
        String sortBy = params.containsKey("sortBy") ? params.get("sortBy").toString() : "timestamp";
        String sortDirection = params.containsKey("sortDirection") ? params.get("sortDirection").toString() : "desc";
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        // Gọi repository với Pageable và các điều kiện
        Page<LedEntity> ledEntities = ledRepository.findByParams(
                deviceName, active, year, month, day, hour, minute, pageable
        );

        // Chuyển đổi từ Page<LedEntity> sang List<LedDTO>
        List<LedDTO> ledDTOs = ledDTOConverter.toLedDTOs(ledEntities.getContent());

        // Tạo Map trả về thông tin phân trang
        Map<String, Object> response = new HashMap<>();
        response.put("content", ledDTOs);
        response.put("currentPage", ledEntities.getNumber() + 1);
        response.put("totalItems", ledEntities.getTotalElements());
        response.put("totalPages", ledEntities.getTotalPages());

        return response;
    }

    

    @Override
    public void saveLedData(LedEntity ledData) {
        ledRepository.save(ledData);
    }

    @Override
    public ResponseEntity<String> controlLed(String deviceName, String action) {
        try {
            // 1. Publish command to MQTT to control the LED
            MqttMessage mqttMessage = new MqttMessage(action.getBytes()); // Tạo MqttMessage từ chuỗi action
            mqttClient.publish(deviceName, mqttMessage); // Gửi MqttMessage đến topic deviceName

            // 2. Create a LedEntity to save the control action
            LedEntity ledData = new LedEntity();
            ledData.setDeviceName(deviceName);
            ledData.setActive(action.equalsIgnoreCase("on") ? "on" : "off");
            ledData.setTimestamp(LocalDateTime.now());

            // 3. Save the LED control data to the database
            saveLedData(ledData);

            // Log the control action
            System.out.println("Successfully sent control message and saved data: " + deviceName + " - " + action);

            // Return success response to Postman
            return ResponseEntity.ok("Successfully controlled : " + deviceName + " - " + action);
        } catch (MqttException e) {
            System.err.println("Failed to publish MQTT message: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to publish MQTT message: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Failed to control: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to control : " + e.getMessage());
        }
    }
    @Override
    public int getWarningCountForToday() {
        LocalDate today = LocalDate.now();
        return ledRepository.countWarningsByDate(today);
    }
}
