package com.loyalty.loyaltypoints.repository;

import com.loyalty.loyaltypoints.entity.Reward;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RewardRepository extends JpaRepository<Reward, Long> {

    List<Reward> findByActiveTrue();
}