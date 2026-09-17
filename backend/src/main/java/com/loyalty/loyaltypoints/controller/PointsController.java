package com.loyalty.loyaltypoints.controller;

import com.loyalty.loyaltypoints.dto.MemberResponse;
import com.loyalty.loyaltypoints.dto.PurchaseRequest;
import com.loyalty.loyaltypoints.dto.RedeemRequest;
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
    public MemberResponse purchase(
            @PathVariable Long memberId,
            @Valid @RequestBody PurchaseRequest request) {

        return MemberResponse.from(
                pointsService.recordPurchase(memberId, request)
        );
    }

    @PostMapping("/redeem")
    public MemberResponse redeem(
            @PathVariable Long memberId,
            @Valid @RequestBody RedeemRequest request) {

        return MemberResponse.from(
                pointsService.redeem(memberId, request)
        );
    }
}