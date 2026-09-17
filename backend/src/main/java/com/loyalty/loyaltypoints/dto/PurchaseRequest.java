package com.loyalty.loyaltypoints.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PurchaseRequest(

        @NotNull(message = "Purchase amount is required")
        @DecimalMin(value = "0.01", message = "Purchase amount must be greater than 0")
        BigDecimal amount

) {
}