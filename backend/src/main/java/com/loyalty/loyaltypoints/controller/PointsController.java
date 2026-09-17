package com.loyalty.loyaltypoints.controller;

import com.loyalty.loyaltypoints.dto.PurchaseRequest;
import com.loyalty.loyaltypoints.dto.RedeemRequest;
import com.loyalty.loyaltypoints.entity.Member;
import com.loyalty.loyaltypoints.service.PointsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members/{memberId}")
@RequiredArgsConstructor
public class PointsController {

    private final PointsService pointsService;

    @PostMapping("/purchases")
    public Member purchase(
            @PathVariable Long memberId,
            @Valid @RequestBody PurchaseRequest request
    ) {
        return pointsService.recordPurchase(memberId, request);
    }

    @PostMapping("/redeem")
    public Member redeem(
            @PathVariable Long memberId,
            @Valid @RequestBody RedeemRequest request
    ) {
        return pointsService.redeem(memberId, request);
    }
}