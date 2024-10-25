package com.example.demo.config;

import com.example.demo.repository.entity.SensorEntity;
import com.example.demo.service.SensorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
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

        client.subscribe("sensors", this::handleMessage);
        client.subscribe("fan", this::handleMessage);
        client.subscribe("airconditioner", this::handleMessage);
        client.subscribe("lightblub", this::handleMessage);
        return client;
    }
    private void handleMessage(String topic, MqttMessage message) {
        String payload = new String(message.getPayload());
        SensorEntity sensorData = parseMessage(payload);
        // Set current timestamp if it's null
        if (sensorData.getTimestamp() == null) {
            sensorData.setTimestamp(LocalDateTime.now());
        }
        sensorService.saveSensorData(sensorData);
    }
    private SensorEntity parseMessage(String message) {
        SensorEntity sensorData = new SensorEntity();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            sensorData = objectMapper.readValue(message, SensorEntity.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return sensorData;
    }
}
