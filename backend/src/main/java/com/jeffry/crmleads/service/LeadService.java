package com.jeffry.crmleads.service;

import com.jeffry.crmleads.dto.LeadDtos.*;
import com.jeffry.crmleads.model.Lead;
import com.jeffry.crmleads.repository.LeadRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadService {

    private final LeadRepository leadRepository;

    public LeadService(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    public LeadResponse criar(NovoLeadRequest req) {
        Lead lead = new Lead();
        lead.setNome(req.nome());
        lead.setWhatsapp(req.whatsapp());
        lead.setModeloInteresse(req.modeloInteresse());
        lead.setUnidade(req.unidade());

        return LeadResponse.from(leadRepository.save(lead));
    }

    public List<LeadResponse> listar() {
        return leadRepository.findAllByOrderByCriadoEmDesc().stream()
            .map(LeadResponse::from)
            .toList();
    }

    public LeadResponse atualizarStatus(Long id, AtualizarStatusRequest req) {
        Lead lead = leadRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Lead não encontrado."));

        lead.setStatus(req.status());

        return LeadResponse.from(leadRepository.save(lead));
    }
}