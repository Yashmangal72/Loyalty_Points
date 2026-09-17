package com.loyalty.loyaltypoints.controller;

import com.loyalty.loyaltypoints.dto.RewardResponse;
import com.loyalty.loyaltypoints.repository.RewardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardRepository rewardRepository;

    @GetMapping
    public List<RewardResponse> getActiveRewards() {
        return rewardRepository.findByActiveTrue()
                .stream()
                .map(RewardResponse::from)
                .toList();
    }
}