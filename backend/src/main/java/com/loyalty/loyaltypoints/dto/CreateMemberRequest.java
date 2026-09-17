package com.loyalty.loyaltypoints.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CreateMemberRequest(

        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Phone is required")
        @Pattern(
                regexp = "^[0-9]{10}$",
                message = "Phone must contain exactly 10 digits"
        )
        String phone,

        String email
) {
}