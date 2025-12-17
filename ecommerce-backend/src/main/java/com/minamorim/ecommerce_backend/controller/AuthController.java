package com.minamorim.ecommerce_backend.controller;

import com.minamorim.ecommerce_backend.dto.LoginRequestDTO;
import com.minamorim.ecommerce_backend.dto.RegistoDTO;
import com.minamorim.ecommerce_backend.dto.TokenDTO;
import com.minamorim.ecommerce_backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody RegistoDTO dto) {
        try {
            TokenDTO token = authService.registrar(dto);
            return ResponseEntity.ok(token);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        try {
            TokenDTO token = authService.login(dto);
            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Login ou senha incorreta");
        }
    }
}
