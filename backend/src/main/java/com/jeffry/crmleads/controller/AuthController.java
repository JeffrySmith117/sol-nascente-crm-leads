package com.jeffry.crmleads.controller;

import com.jeffry.crmleads.dto.AuthDtos.*;
import com.jeffry.crmleads.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

// login do admin do CRM; nao existe cadastro publico - o unico usuario admin
// e semeado direto no banco via migration
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public TokenResponse login(@Valid @RequestBody LoginRequest req) {
        return usuarioService.login(req);
    }
}