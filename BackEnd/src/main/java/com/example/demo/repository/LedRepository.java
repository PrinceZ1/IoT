package com.example.demo.repository;

import com.example.demo.repository.entity.LedEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface LedRepository extends JpaRepository<LedEntity, Long> {
    @Query("SELECT l FROM LedEntity l WHERE "
            + "(:deviceName IS NULL OR l.deviceName = :deviceName) "
            + "AND (:active IS NULL OR l.active = :active) "
            + "AND (:year IS NULL OR FUNCTION('YEAR', l.timestamp) = :year) "
            + "AND (:month IS NULL OR FUNCTION('MONTH', l.timestamp) = :month) "
            + "AND (:day IS NULL OR FUNCTION('DAY', l.timestamp) = :day) "
            + "AND (:hour IS NULL OR FUNCTION('HOUR', l.timestamp) = :hour) "
            + "AND (:minute IS NULL OR FUNCTION('MINUTE', l.timestamp) = :minute)")
    Page<LedEntity> findByParams(@Param("deviceName") String deviceName,
                                 @Param("active") String active,
                                 @Param("year") Integer year,
                                 @Param("month") Integer month,
                                 @Param("day") Integer day,
                                 @Param("hour") Integer hour,
                                 @Param("minute") Integer minute,
                                 Pageable pageable);
    LedEntity findTopByDeviceNameOrderByTimestampDesc(String deviceName);
}
