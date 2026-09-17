package com.loyalty.loyaltypoints.repository;

import com.loyalty.loyaltypoints.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByPhone(String phone);

    Page<Member> findByNameContainingIgnoreCaseOrPhoneContaining(
            String name,
            String phone,
            Pageable pageable
    );
}