package com.example.demo.converter;

import com.example.demo.model.LedDTO;
import com.example.demo.model.SensorDTO;
import com.example.demo.repository.entity.LedEntity;
import com.example.demo.repository.entity.SensorEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class LedDTOConverter {
    public LedDTO toLedDTO(LedEntity entity) {
        LedDTO dto = new LedDTO();

        dto.setId(entity.getId());
        dto.setActive(entity.getActive());
        dto.setDeviceName(entity.getDeviceName());
        dto.setTimestamp(entity.getTimestamp());

        return dto;
    }
    public List<LedDTO> toLedDTOs(List<LedEntity> entities) {
        return entities.stream()
                .map(this::toLedDTO)
                .collect(Collectors.toList());
    }
}
