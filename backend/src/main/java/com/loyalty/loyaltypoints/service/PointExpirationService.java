package com.loyalty.loyaltypoints.service;

import com.loyalty.loyaltypoints.entity.Member;
import com.loyalty.loyaltypoints.entity.PointsTransaction;
import com.loyalty.loyaltypoints.entity.TransactionType;
import com.loyalty.loyaltypoints.repository.MemberRepository;
import com.loyalty.loyaltypoints.repository.PointsTransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PointExpirationService {

    private final PointsTransactionRepository transactionRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public int expirePoints(LocalDateTime clockTime) {

        List<PointsTransaction> expired =
            transactionRepository.findByTypeAndExpiresAtBefore(
                TransactionType.EARN,
                clockTime
            );

        int expiredCount = 0;

        for (PointsTransaction earn : expired) {

            Member member = earn.getMember();

            BigDecimal amount = earn.getPoints();

            if (member.getCurrentPoints().compareTo(amount) >= 0) {

                member.setCurrentPoints(
                    member.getCurrentPoints().subtract(amount)
                );

                memberRepository.save(member);

                PointsTransaction expiration =
                    PointsTransaction.builder()
                        .member(member)
                        .type(TransactionType.REDEEM)
                        .points(amount.negate())
                        .description("Points expired after 90 days")
                        .balanceAfter(member.getCurrentPoints())
                        .createdAt(clockTime)
                        .build();

                transactionRepository.save(expiration);

                expiredCount++;
            }

            // Prevent processing the same earning transaction again.
            earn.setExpiresAt(null);
            transactionRepository.save(earn);
        }

        return expiredCount;
    }
}