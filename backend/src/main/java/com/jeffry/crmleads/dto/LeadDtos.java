package com.jeffry.crmleads.dto;

import com.jeffry.crmleads.model.Lead;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class LeadDtos {

    public record NovoLeadRequest(
        @NotBlank String nome,
        @NotBlank String whatsapp,
        @NotBlank String modeloInteresse,
        @NotNull Lead.Unidade unidade
    ) {}

    public record AtualizarStatusRequest(
        @NotNull Lead.StatusLead status
    ) {}

    public record LeadResponse(
        Long id,
        String nome,
        String whatsapp,
        String modeloInteresse,
        Lead.Unidade unidade,
        Lead.StatusLead status,
        LocalDateTime criadoEm
    ) {
        public static LeadResponse from(Lead l) {
            return new LeadResponse(
                l.getId(),
                l.getNome(),
                l.getWhatsapp(),
                l.getModeloInteresse(),
                l.getUnidade(),
                l.getStatus(),
                l.getCriadoEm()
            );
        }
    }
}