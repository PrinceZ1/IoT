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
            + "AND (:timestamp IS NULL OR l.timestamp = :timestamp)")
    Page<LedEntity> findByExactTimestamp(@Param("deviceName") String deviceName,
                                         @Param("active") String active,
                                         @Param("timestamp") LocalDateTime timestamp,
                                         Pageable pageable);
    LedEntity findTopByDeviceNameOrderByTimestampDesc(String deviceName);
}
