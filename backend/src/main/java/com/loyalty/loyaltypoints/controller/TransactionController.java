package com.loyalty.loyaltypoints.controller;

import com.loyalty.loyaltypoints.dto.TransactionResponse;
import com.loyalty.loyaltypoints.repository.PointsTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members/{memberId}/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final PointsTransactionRepository transactionRepository;

    @GetMapping
    public Page<TransactionResponse> getTransactions(
            @PathVariable Long memberId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return transactionRepository
                .findByMemberIdOrderByCreatedAtDesc(
                        memberId,
                        PageRequest.of(page, size)
                )
                .map(TransactionResponse::from);
    }
}