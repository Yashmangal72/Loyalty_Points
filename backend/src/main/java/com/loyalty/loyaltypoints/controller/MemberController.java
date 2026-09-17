package com.loyalty.loyaltypoints.controller;

import com.loyalty.loyaltypoints.dto.CreateMemberRequest;
import com.loyalty.loyaltypoints.dto.MemberResponse;
import com.loyalty.loyaltypoints.entity.Member;
import com.loyalty.loyaltypoints.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MemberResponse createMember(
            @Valid @RequestBody CreateMemberRequest request) {

        return MemberResponse.from(
                memberService.createMember(
                        request.name(),
                        request.phone(),
                        request.email()
                )
        );
    }

    @GetMapping("/{id}")
    public MemberResponse getMember(@PathVariable Long id) {
        return MemberResponse.from(memberService.getMember(id));
    }

    @GetMapping("/phone/{phone}")
    public MemberResponse getByPhone(@PathVariable String phone) {
        return MemberResponse.from(memberService.findByPhone(phone));
    }

    @GetMapping
    public Page<MemberResponse> searchMembers(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort.Direction sortDirection =
                direction.equalsIgnoreCase("desc")
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortDirection, sortBy)
        );

        return memberService.searchMembers(search, pageable)
                .map(MemberResponse::from);
    }
}