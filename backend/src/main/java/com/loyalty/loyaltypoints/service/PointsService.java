package com.loyalty.loyaltypoints.service;

import com.loyalty.loyaltypoints.dto.PurchaseRequest;
import com.loyalty.loyaltypoints.dto.RedeemRequest;
import com.loyalty.loyaltypoints.entity.*;
import com.loyalty.loyaltypoints.repository.MemberRepository;
import com.loyalty.loyaltypoints.repository.PointsTransactionRepository;
import com.loyalty.loyaltypoints.repository.RewardRepository;
import com.loyalty.loyaltypoints.repository.TierRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PointsService {

    private final MemberRepository memberRepository;
    private final TierRepository tierRepository;
    private final RewardRepository rewardRepository;
    private final PointsTransactionRepository transactionRepository;

    @Transactional
    public Member recordPurchase(Long memberId, PurchaseRequest request) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        BigDecimal amount = request.amount();

        /*
         * Points calculation:
         * amount / 100 × tier multiplier
         */
        BigDecimal pointsEarned = amount
                .divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP)
                .multiply(member.getTier().getPointsMultiplier())
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal newBalance = member.getCurrentPoints()
                .add(pointsEarned);

        BigDecimal newLifetimePoints = member.getLifetimeEarnedPoints()
                .add(pointsEarned);

        // Update tier based on lifetime earned points
        Tier newTier = findTier(newLifetimePoints);

        member.setCurrentPoints(newBalance);
        member.setLifetimeEarnedPoints(newLifetimePoints);
        member.setTier(newTier);

        memberRepository.save(member);

        // Points earned expire after 90 days
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(90);

        PointsTransaction transaction = PointsTransaction.builder()
                .member(member)
                .type(TransactionType.EARN)
                .points(pointsEarned)
                .purchaseAmount(amount)
                .description("Purchase points earned")
                .balanceAfter(newBalance)
                .expiresAt(expiresAt)
                .build();

        transactionRepository.save(transaction);

        return member;
    }

    @Transactional
    public Member redeem(Long memberId, RedeemRequest request) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Reward reward = rewardRepository.findById(request.rewardId())
                .orElseThrow(() -> new RuntimeException("Reward not found"));

        if (!reward.isActive()) {
            throw new RuntimeException("Reward is not active");
        }

        if (member.getCurrentPoints().compareTo(reward.getPointsCost()) < 0) {
            throw new RuntimeException("Insufficient points");
        }

        BigDecimal newBalance = member.getCurrentPoints()
                .subtract(reward.getPointsCost());

        member.setCurrentPoints(newBalance);

        memberRepository.save(member);

        PointsTransaction transaction = PointsTransaction.builder()
                .member(member)
                .type(TransactionType.REDEEM)
                .points(reward.getPointsCost().negate())
                .reward(reward)
                .description("Redeemed: " + reward.getName())
                .balanceAfter(newBalance)
                .build();

        transactionRepository.save(transaction);

        return member;
    }

    /**
     * Expires unused points whose 90-day expiry time has passed.
     */
    @Transactional
    public int expirePoints(LocalDateTime clockTime) {

        List<PointsTransaction> expiredTransactions =
                transactionRepository.findByTypeAndExpiresAtBefore(
                        TransactionType.EARN,
                        clockTime
                );

        int expiredCount = 0;

        for (PointsTransaction transaction : expiredTransactions) {

            Member member = transaction.getMember();

            BigDecimal pointsToExpire =
                    transaction.getPoints().min(member.getCurrentPoints());

            if (pointsToExpire.compareTo(BigDecimal.ZERO) > 0) {

                BigDecimal newBalance =
                        member.getCurrentPoints().subtract(pointsToExpire);

                member.setCurrentPoints(newBalance);
                memberRepository.save(member);

                PointsTransaction expiration = PointsTransaction.builder()
                        .member(member)
                        .type(TransactionType.REDEEM)
                        .points(pointsToExpire.negate())
                        .description("Points expired after 90 days")
                        .balanceAfter(newBalance)
                        .build();

                transactionRepository.save(expiration);

                expiredCount++;
            }

            // Prevent this transaction from being processed again
            transaction.setExpiresAt(null);
            transactionRepository.save(transaction);
        }

        return expiredCount;
    }

    private Tier findTier(BigDecimal lifetimePoints) {

        return tierRepository.findAll()
                .stream()
                .filter(tier ->
                        lifetimePoints.compareTo(
                                tier.getMinimumLifetimePoints()
                        ) >= 0
                )
                .max((a, b) ->
                        a.getMinimumLifetimePoints()
                                .compareTo(b.getMinimumLifetimePoints())
                )
                .orElseThrow(() -> new RuntimeException("No tier configured"));
    }
}