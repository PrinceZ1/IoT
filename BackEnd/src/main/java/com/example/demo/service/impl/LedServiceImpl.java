package com.example.demo.service.impl;

import com.example.demo.converter.LedDTOConverter;
import com.example.demo.model.LedDTO;
import com.example.demo.repository.LedRepository;
import com.example.demo.repository.entity.LedEntity;
import com.example.demo.service.LedService;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.*;

@Service
public class LedServiceImpl implements LedService {

    @Autowired
    private LedRepository ledRepository;

    @Autowired
    private LedDTOConverter ledDTOConverter;

    @Autowired
    private MqttClient mqttClient;

    // Map to hold CompletableFuture for each device awaiting confirmation
    private final Map<String, CompletableFuture<String>> confirmationFutures = new ConcurrentHashMap<>();

    @Override
    public Map<String, Object> getLed(Map<String, Object> params) {
        String deviceName = params.containsKey("deviceName") ? params.get("deviceName").toString() : null;
        String active = params.containsKey("active") ? params.get("active").toString() : null;

        LocalDateTime exactTimestamp = null;

        // Kiểm tra và xử lý tham số timestamp
        if (params.containsKey("timestamp")) {
            String timestampParam = params.get("timestamp").toString();

            // Nếu timestamp có định dạng "dd/MM/yyyy, HH:mm:ss"
            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy, HH:mm:ss");
            exactTimestamp = LocalDateTime.parse(timestampParam, dateTimeFormatter);
        }

        // Get pageSize and pageNumber from params
        int pageSize = params.containsKey("pageSize") ? Integer.parseInt(params.get("pageSize").toString()) : 10;
        int pageNumber = params.containsKey("pageNumber") ? Integer.parseInt(params.get("pageNumber").toString()) : 0;

        // Handle sorting
        String sortBy = params.containsKey("sortBy") ? params.get("sortBy").toString() : "timestamp";
        String sortDirection = params.containsKey("sortDirection") ? params.get("sortDirection").toString() : "desc";
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        // Gọi repository với Pageable và điều kiện tìm kiếm
        Page<LedEntity> ledEntities = ledRepository.findByExactTimestamp(
                deviceName, active, exactTimestamp, pageable
        );

        // Chuyển đổi Page<LedEntity> thành List<LedDTO>
        List<LedDTO> ledDTOs = ledDTOConverter.toLedDTOs(ledEntities.getContent());

        // Tạo response map với thông tin phân trang
        Map<String, Object> response = new HashMap<>();
        response.put("content", ledDTOs);
        response.put("currentPage", ledEntities.getNumber() + 1);
        response.put("totalItems", ledEntities.getTotalElements());
        response.put("totalPages", ledEntities.getTotalPages());

        return response;
    }


    @Override
    public Map<String, String> getCurrentDeviceStatuses() {
        Map<String, String> deviceStatuses = new HashMap<>();

        // List of your device names
        List<String> deviceNames = Arrays.asList("fan", "airConditioner", "lightbulb", "warning");

        for (String deviceName : deviceNames) {
            LedEntity latestLedEntity = ledRepository.findTopByDeviceNameOrderByTimestampDesc(deviceName);
            if (latestLedEntity != null) {
                deviceStatuses.put(deviceName, latestLedEntity.getActive());
            } else {
                // Default status if no data found
                deviceStatuses.put(deviceName, "unknown");
            }
        }

        return deviceStatuses;
    }

    @Override
    public void saveLedData(LedEntity ledData) {
        ledRepository.save(ledData);
    }

    @Override
    public ResponseEntity<String> controlLed(String deviceName, String action) {
        try {
            // Create a CompletableFuture to wait for confirmation
            CompletableFuture<String> confirmationFuture = new CompletableFuture<>();
            confirmationFutures.put(deviceName, confirmationFuture);

            // Publish command to MQTT to control the device
            MqttMessage mqttMessage = new MqttMessage(action.getBytes());
            mqttClient.publish(deviceName, mqttMessage);

            // Wait for confirmation (e.g., 5 seconds timeout)
            String confirmation = confirmationFuture.get(5, TimeUnit.SECONDS);

            if (confirmation.equalsIgnoreCase("on") || confirmation.equalsIgnoreCase("off")) {
                // Device confirmed state change

                // Create a LedEntity to save the control action
//                LedEntity ledData = new LedEntity();
//                ledData.setDeviceName(deviceName);
//                ledData.setActive(confirmation);
//                ledData.setTimestamp(LocalDateTime.now());
//
//                // Save the LED control data to the database
//                saveLedData(ledData);

                // Log the control action
                System.out.println("Successfully controlled and confirmed: " + deviceName + " - " + confirmation);

                // Return success response to frontend
                return ResponseEntity.ok("Successfully controlled: " + deviceName + " - " + confirmation);
            } else {
                // Device failed to change state
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Device failed to change state: " + deviceName);
            }
        } catch (TimeoutException e) {
            // Timeout waiting for confirmation
            System.err.println("Timeout waiting for device confirmation: " + deviceName);
            return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT)
                    .body("Timeout waiting for device confirmation: " + deviceName);
        } catch (Exception e) {
            // Other exceptions
            System.err.println("Failed to control device: " + deviceName + ". Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to control device: " + deviceName + ". Error: " + e.getMessage());
        } finally {
            // Clean up the future
            confirmationFutures.remove(deviceName);
        }
    }

    @PostConstruct
    public void init() throws MqttException {
        mqttClient.setCallback(new MqttCallback() {
            @Override
            public void connectionLost(Throwable cause) {
                System.err.println("MQTT connection lost: " + cause.getMessage());
            }

            @Override
            public void messageArrived(String topic, MqttMessage message) throws Exception {
                // Assuming confirmation topics are like "fan/confirmation"
                String confirmationTopicSuffix = "/confirmation";
                if (topic.endsWith(confirmationTopicSuffix)) {
                    String deviceName = topic.substring(0, topic.length() - confirmationTopicSuffix.length());
                    String messageContent = new String(message.getPayload());

                    System.out.println("Received confirmation from device: " + deviceName + " - " + messageContent);

                    // Check if there is a future waiting for this device's confirmation
                    CompletableFuture<String> future = confirmationFutures.get(deviceName);
                    if (future != null) {
                        if (messageContent.equalsIgnoreCase("on") || messageContent.equalsIgnoreCase("off")) {
                            future.complete(messageContent.toLowerCase());
                        } else {
                            future.complete("failure");
                        }
                    }

                    // Update the device status in the database
                    LedEntity ledData = new LedEntity();
                    ledData.setDeviceName(deviceName);
                    ledData.setActive(messageContent.equalsIgnoreCase("on") ? "on" : "off");
                    ledData.setTimestamp(LocalDateTime.now());
                    saveLedData(ledData);

                } else {
                    // Handle other messages if necessary
                    System.out.println("Received message on unknown topic: " + topic);
                }
            }

            @Override
            public void deliveryComplete(IMqttDeliveryToken token) {
                // Handle delivery complete if necessary
            }
        });

        // Subscribe to confirmation topics
        mqttClient.subscribe("fan/confirmation");
        mqttClient.subscribe("airConditioner/confirmation");
        mqttClient.subscribe("lightbulb/confirmation");
        mqttClient.subscribe("warning/confirmation");
    }
}
