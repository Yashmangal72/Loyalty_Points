package com.loyalty.loyaltypoints.repository;

import com.loyalty.loyaltypoints.entity.PointsTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointsTransactionRepository
        extends JpaRepository<PointsTransaction, Long> {

    Page<PointsTransaction> findByMemberId(
            Long memberId,
            Pageable pageable
    );

    Page<PointsTransaction> findByMemberIdOrderByCreatedAtDesc(
        Long memberId,
        Pageable pageable
);
}