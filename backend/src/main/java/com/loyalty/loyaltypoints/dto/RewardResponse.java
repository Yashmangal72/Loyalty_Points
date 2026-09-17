package com.loyalty.loyaltypoints.dto;

import com.loyalty.loyaltypoints.entity.Reward;

import java.math.BigDecimal;

public record RewardResponse(
        Long id,
        String name,
        BigDecimal pointsCost,
        String description
) {

    public static RewardResponse from(Reward reward) {
        return new RewardResponse(
                reward.getId(),
                reward.getName(),
                reward.getPointsCost(),
                reward.getDescription()
        );
    }
}