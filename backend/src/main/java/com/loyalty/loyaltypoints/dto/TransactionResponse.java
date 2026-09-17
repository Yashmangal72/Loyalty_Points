package com.loyalty.loyaltypoints.dto;

import com.loyalty.loyaltypoints.entity.PointsTransaction;
import com.loyalty.loyaltypoints.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
        Long id,
        TransactionType type,
        BigDecimal points,
        BigDecimal purchaseAmount,
        String rewardName,
        String description,
        BigDecimal balanceAfter,
        LocalDateTime createdAt
) {

    public static TransactionResponse from(PointsTransaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getPoints(),
                transaction.getPurchaseAmount(),
                transaction.getReward() != null
                        ? transaction.getReward().getName()
                        : null,
                transaction.getDescription(),
                transaction.getBalanceAfter(),
                transaction.getCreatedAt()
        );
    }
}