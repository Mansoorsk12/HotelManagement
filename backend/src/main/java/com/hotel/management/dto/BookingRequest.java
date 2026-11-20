package com.hotel.management.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record BookingRequest(
    @NotNull(message = "Customer id is required") Long customerId,
    @NotNull(message = "Room id is required") Long roomId,
    @NotNull(message = "Check-in date is required")
    @FutureOrPresent(message = "Check-in date cannot be in the past") LocalDate checkInDate,
    @NotNull(message = "Check-out date is required") LocalDate checkOutDate
) {}