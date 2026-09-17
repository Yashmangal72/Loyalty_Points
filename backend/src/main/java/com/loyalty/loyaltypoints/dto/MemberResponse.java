package com.loyalty.loyaltypoints.dto;

import com.loyalty.loyaltypoints.entity.Member;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MemberResponse(
        Long id,
        String name,
        String phone,
        String email,
        BigDecimal currentPoints,
        BigDecimal lifetimeEarnedPoints,
        String tier,
        BigDecimal pointsMultiplier,
        LocalDateTime createdAt
) {

    public static MemberResponse from(Member member) {
        return new MemberResponse(
                member.getId(),
                member.getName(),
                member.getPhone(),
                member.getEmail(),
                member.getCurrentPoints(),
                member.getLifetimeEarnedPoints(),
                member.getTier().getName(),
                member.getTier().getPointsMultiplier(),
                member.getCreatedAt()
        );
    }
}