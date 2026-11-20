package com.hotel.management.repository;

import com.hotel.management.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
        SELECT COUNT(b) FROM Booking b
        WHERE b.room.id = :roomId
          AND b.status <> com.hotel.management.enums.BookingStatus.CANCELLED
          AND b.checkInDate < :checkOut
          AND b.checkOutDate > :checkIn
        """)
    long countOverlapping(@Param("roomId") Long roomId,
                          @Param("checkIn") LocalDate checkIn,
                          @Param("checkOut") LocalDate checkOut);
}