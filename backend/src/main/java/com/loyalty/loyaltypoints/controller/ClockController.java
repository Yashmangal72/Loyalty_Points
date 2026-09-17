package com.loyalty.loyaltypoints.controller;

import com.loyalty.loyaltypoints.service.PointExpirationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/clock")
@RequiredArgsConstructor
public class ClockController {

    private final PointExpirationService expirationService;

    @PostMapping
    public Map<String, Object> advanceClock(
            @RequestParam(required = false) String at
    ) {

        LocalDateTime clockTime =
                at == null
                    ? LocalDateTime.now()
                    : LocalDateTime.parse(at);

        int expired =
                expirationService.expirePoints(clockTime);

        return Map.of(
            "clock", clockTime,
            "expiredTransactions", expired
        );
    }
}