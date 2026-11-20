package com.hotel.management.dto;

import jakarta.validation.constraints.*;

public record RegisterRequest(
    @NotBlank(message = "Full name is required") String fullName,
    @NotBlank(message = "Email is required") @Email(message = "Email format is invalid") String email,
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters") String password
) {}