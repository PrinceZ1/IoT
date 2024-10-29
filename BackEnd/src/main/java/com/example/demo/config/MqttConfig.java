package com.example.demo.config;

import com.example.demo.repository.entity.SensorEntity;
import com.example.demo.service.SensorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class MqttConfig {

    private static final String BROKER_URL = "tcp://172.20.10.4:1889";
    private static final String CLIENT_ID = "iotClient";
    private static final String USERNAME = "nguyen";
    private static final String PASSWORD = "12345";

    @Autowired
    private SensorService sensorService;

    @Bean
    public MqttClient mqttClient() throws MqttException {
        MqttClient client = new MqttClient(BROKER_URL, CLIENT_ID);
        MqttConnectOptions options = new MqttConnectOptions();
        options.setUserName(USERNAME);
        options.setPassword(PASSWORD.toCharArray());
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);
        client.connect(options);

        client.subscribe("sensors", this::handleSensorMessage);
        client.subscribe("fan", this::handleDeviceMessage);
        client.subscribe("airConditioner", this::handleDeviceMessage);
        client.subscribe("lightbulb", this::handleDeviceMessage);
        client.subscribe("warningLight", this::handleDeviceMessage);
        return client;
    }

    private void handleSensorMessage(String topic, MqttMessage message) {
        String payload = new String(message.getPayload());
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            SensorEntity sensorData = objectMapper.readValue(payload, SensorEntity.class);

            // Set current timestamp if it's null
            if (sensorData.getTimestamp() == null) {
                sensorData.setTimestamp(LocalDateTime.now());
            }

            sensorService.saveSensorData(sensorData);
        } catch (Exception e) {
            System.err.println("Failed to parse sensor data: " + payload);
            e.printStackTrace();
        }
    }

    private void handleDeviceMessage(String topic, MqttMessage message) {
        String payload = new String(message.getPayload());
        System.out.println("Received command on topic [" + topic + "]: " + payload);
        // Xử lý lệnh điều khiển thiết bị nếu cần
        // Bạn có thể cập nhật trạng thái thiết bị trong cơ sở dữ liệu hoặc thực hiện hành động khác
    }
}
