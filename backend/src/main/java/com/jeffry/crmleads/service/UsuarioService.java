package com.jeffry.crmleads.service;

import com.jeffry.crmleads.dto.AuthDtos.*;
import com.jeffry.crmleads.config.JwtUtil;
import com.jeffry.crmleads.model.Usuario;
import com.jeffry.crmleads.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public TokenResponse login(LoginRequest req) {
        Usuario usuario = usuarioRepository.findByEmail(req.email())
            .orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas."));

        if (!passwordEncoder.matches(req.senha(), usuario.getSenhaHash())) {
            throw new IllegalArgumentException("Credenciais inválidas.");
        }

        String token = jwtUtil.gerarToken(usuario.getEmail(), usuario.getPerfil().name());
        return new TokenResponse(token, usuario.getNome(), usuario.getPerfil().name());
    }
}