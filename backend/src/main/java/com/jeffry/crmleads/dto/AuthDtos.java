package com.jeffry.crmleads.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDtos {

    public record LoginRequest(
        @Email String email,
        @NotBlank String senha
    ) {}

    public record TokenResponse(String token, String nome, String perfil) {}
}