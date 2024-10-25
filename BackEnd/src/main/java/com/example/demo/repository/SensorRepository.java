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
            + "AND (:year IS NULL OR FUNCTION('YEAR', s.timestamp) = :year) "
            + "AND (:month IS NULL OR FUNCTION('MONTH', s.timestamp) = :month) "
            + "AND (:day IS NULL OR FUNCTION('DAY', s.timestamp) = :day) "
            + "AND (:hour IS NULL OR FUNCTION('HOUR', s.timestamp) = :hour) "
            + "AND (:minute IS NULL OR FUNCTION('MINUTE', s.timestamp) = :minute)")
    Page<SensorEntity> findByParams(@Param("temperature") Integer temperature,
                                    @Param("humidity") Integer humidity,
                                    @Param("light") Integer light,
                                    @Param("year") Integer year,
                                    @Param("month") Integer month,
                                    @Param("day") Integer day,
                                    @Param("hour") Integer hour,
                                    @Param("minute") Integer minute,
                                    Pageable pageable);

    SensorEntity findTopByOrderByTimestampDesc();
}
