package com.jeffry.crmleads.controller;

import com.jeffry.crmleads.dto.LeadDtos.*;
import com.jeffry.crmleads.service.LeadService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    // publico: usado pelo formulario da landing page
    @PostMapping
    public LeadResponse criar(@Valid @RequestBody NovoLeadRequest req) {
        return leadService.criar(req);
    }

    // restrito a ADMIN: usado pelo painel administrativo
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<LeadResponse> listar() {
        return leadService.listar();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public LeadResponse atualizarStatus(@PathVariable Long id, @Valid @RequestBody AtualizarStatusRequest req) {
        return leadService.atualizarStatus(id, req);
    }
}