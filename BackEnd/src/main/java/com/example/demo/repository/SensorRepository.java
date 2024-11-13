package com.example.demo.repository;

import com.example.demo.repository.entity.SensorEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SensorRepository extends JpaRepository<SensorEntity, Long> {
    @Query("SELECT s FROM SensorEntity s WHERE "
            + "(:temperature IS NULL OR s.temperature = :temperature) "
            + "AND (:humidity IS NULL OR s.humidity = :humidity) "
            + "AND (:light IS NULL OR s.light = :light) "
            + "AND (:wind IS NULL OR s.wind = :wind) "
            + "AND (:timestamp IS NULL OR s.timestamp = :timestamp)")
    Page<SensorEntity> findByExactTimestamp(@Param("temperature") Integer temperature,
                                            @Param("humidity") Integer humidity,
                                            @Param("light") Integer light,
                                            @Param("wind") Integer wind,
                                            @Param("timestamp") LocalDateTime timestamp,
                                            Pageable pageable);

    SensorEntity findTopByOrderByTimestampDesc();
}
