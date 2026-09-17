package com.loyalty.loyaltypoints.config;

import com.loyalty.loyaltypoints.entity.Reward;
import com.loyalty.loyaltypoints.entity.Tier;
import com.loyalty.loyaltypoints.repository.RewardRepository;
import com.loyalty.loyaltypoints.repository.TierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            TierRepository tierRepository,
            RewardRepository rewardRepository
    ) {
        return args -> {

            // Tiers
            if (tierRepository.count() == 0) {

                tierRepository.save(Tier.builder()
                        .name("BRONZE")
                        .minimumLifetimePoints(BigDecimal.ZERO)
                        .pointsMultiplier(new BigDecimal("1.0"))
                        .build());

                tierRepository.save(Tier.builder()
                        .name("SILVER")
                        .minimumLifetimePoints(new BigDecimal("500"))
                        .pointsMultiplier(new BigDecimal("1.5"))
                        .build());

                tierRepository.save(Tier.builder()
                        .name("GOLD")
                        .minimumLifetimePoints(new BigDecimal("1500"))
                        .pointsMultiplier(new BigDecimal("2.0"))
                        .build());
            }

            // Rewards
            if (rewardRepository.count() == 0) {

                rewardRepository.save(Reward.builder()
                        .name("Free Coffee")
                        .pointsCost(new BigDecimal("100"))
                        .description("Redeem for one regular coffee")
                        .active(true)
                        .build());

                rewardRepository.save(Reward.builder()
                        .name("Free Dessert")
                        .pointsCost(new BigDecimal("200"))
                        .description("Redeem for one selected dessert")
                        .active(true)
                        .build());

                rewardRepository.save(Reward.builder()
                        .name("₹100 Voucher")
                        .pointsCost(new BigDecimal("500"))
                        .description("Get ₹100 off your next purchase")
                        .active(true)
                        .build());
            }
        };
    }
}