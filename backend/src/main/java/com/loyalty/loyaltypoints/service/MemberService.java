package com.loyalty.loyaltypoints.service;

import com.loyalty.loyaltypoints.entity.Member;
import com.loyalty.loyaltypoints.entity.Tier;
import com.loyalty.loyaltypoints.repository.MemberRepository;
import com.loyalty.loyaltypoints.repository.TierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final TierRepository tierRepository;

    public Member createMember(String name, String phone, String email) {

        if (memberRepository.findByPhone(phone).isPresent()) {
            throw new RuntimeException("Phone number already registered");
        }

        Tier bronze = tierRepository.findByName("BRONZE")
                .orElseThrow(() -> new RuntimeException("Bronze tier not found"));

        Member member = Member.builder()
                .name(name)
                .phone(phone)
                .email(email)
                .currentPoints(BigDecimal.ZERO)
                .lifetimeEarnedPoints(BigDecimal.ZERO)
                .tier(bronze)
                .build();

        return memberRepository.save(member);
    }

    public Member getMember(Long id) {

        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }

    public Member findByPhone(String phone) {

        return memberRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }

    public Page<Member> searchMembers(
            String search,
            Pageable pageable
    ) {

        if (search == null || search.isBlank()) {
            return memberRepository.findAll(pageable);
        }

        return memberRepository
                .findByNameContainingIgnoreCaseOrPhoneContaining(
                        search,
                        search,
                        pageable
                );
    }
}