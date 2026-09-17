package com.loyalty.loyaltypoints.controller;

import com.loyalty.loyaltypoints.dto.LoginRequest;
import com.loyalty.loyaltypoints.dto.RegisterRequest;
import com.loyalty.loyaltypoints.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public Map<String, String> register(
            @Valid @RequestBody RegisterRequest request) {

        return Map.of(
                "token",
                authService.register(request)
        );
    }

    @PostMapping("/login")
    public Map<String, String> login(
            @Valid @RequestBody LoginRequest request) {

        return Map.of(
                "token",
                authService.login(request)
        );
    }
}