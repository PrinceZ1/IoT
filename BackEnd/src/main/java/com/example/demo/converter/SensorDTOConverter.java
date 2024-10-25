package com.example.demo.converter;

import com.example.demo.model.SensorDTO;
import com.example.demo.repository.entity.SensorEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;


@Component
public class SensorDTOConverter {
    public SensorDTO toSensorDTO(SensorEntity entity) {
        SensorDTO dto = new SensorDTO();

        // Kiểm tra null trước khi gán
        dto.setId(entity.getId());
        dto.setTemperature(entity.getTemperature() != null ? entity.getTemperature() : 0);
        dto.setHumidity(entity.getHumidity() != null ? entity.getHumidity() : 0);
        dto.setLight(entity.getLight() != null ? entity.getLight() : 0);

        // Giữ LocalDateTime nếu không null
        dto.setTimestamp(entity.getTimestamp()); // Timestamp được giữ nguyên kiểu LocalDateTime

        return dto;
    }
    public List<SensorDTO> toSensorDTOs(List<SensorEntity> entities) {
        return entities.stream()
                .map(this::toSensorDTO)
                .collect(Collectors.toList());
    }
}
