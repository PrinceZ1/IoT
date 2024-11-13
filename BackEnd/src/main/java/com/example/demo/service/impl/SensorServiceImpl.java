package com.example.demo.service.impl;

import com.example.demo.converter.SensorDTOConverter;
import com.example.demo.model.SensorDTO;
import com.example.demo.repository.SensorRepository;
import com.example.demo.repository.entity.SensorEntity;
import com.example.demo.service.SensorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SensorServiceImpl implements SensorService {
    @Autowired
    private SensorRepository sensorRepository;
    @Autowired
    private SensorDTOConverter sensorDTOConverter;

    @Override
    public Map<String, Object> getSensor(Map<String, Object> params) {
        Integer temperature = params.containsKey("temperature") ? Integer.valueOf(params.get("temperature").toString()) : null;
        Integer humidity = params.containsKey("humidity") ? Integer.valueOf(params.get("humidity").toString()) : null;
        Integer light = params.containsKey("light") ? Integer.valueOf(params.get("light").toString()) : null;
        Integer wind = params.containsKey("wind") ? Integer.valueOf(params.get("wind").toString()) : null;

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

        // Sử dụng Sort.Direction.fromString() để tạo Sort object
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        // Gọi repository với Pageable và các điều kiện
        Page<SensorEntity> sensorEntities = sensorRepository.findByParams(
                temperature, humidity, light, wind, year, month, day, hour, pageable
        );

        // Chuyển đổi từ Page<SensorEntity> sang List<SensorDTO>
        List<SensorDTO> result = sensorDTOConverter.toSensorDTOs(sensorEntities.getContent());

        // Tạo Map trả về thông tin phân trang
        Map<String, Object> response = new HashMap<>();
        response.put("content", result);
        response.put("currentPage", sensorEntities.getNumber() + 1);
        response.put("totalItems", sensorEntities.getTotalElements());
        response.put("totalPages", sensorEntities.getTotalPages());
        response.put("pageSize", pageSize);

        return response;
    }

    @Override
    public SensorDTO getLatestSensorData() {
        // Lấy dữ liệu entity mới nhất từ repository
        SensorEntity latestEntity = sensorRepository.findTopByOrderByTimestampDesc();
        sensorDTOConverter.toSensorDTO(latestEntity);

        return sensorDTOConverter.toSensorDTO(latestEntity);
    }

    @Override
    public void saveSensorData(SensorEntity sensorData) {
        sensorRepository.save(sensorData);
    }
}
