package com.loyalty.loyaltypoints.dto;

import jakarta.validation.constraints.NotNull;

public record RedeemRequest(

        @NotNull(message = "Reward ID is required")
        Long rewardId

) {
}