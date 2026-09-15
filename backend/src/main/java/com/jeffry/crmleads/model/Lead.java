package com.jeffry.crmleads.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nome;

    @NotBlank
    @Column(nullable = false)
    private String whatsapp;

    @NotBlank
    @Column(name = "modelo_interesse", nullable = false)
    private String modeloInteresse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Unidade unidade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusLead status = StatusLead.NOVO;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    public enum Unidade { TERESINA, TIMON }
    public enum StatusLead { NOVO, EM_CONTATO, CONVERTIDO, PERDIDO }

    public Lead() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }

    public String getModeloInteresse() { return modeloInteresse; }
    public void setModeloInteresse(String modeloInteresse) { this.modeloInteresse = modeloInteresse; }

    public Unidade getUnidade() { return unidade; }
    public void setUnidade(Unidade unidade) { this.unidade = unidade; }

    public StatusLead getStatus() { return status; }
    public void setStatus(StatusLead status) { this.status = status; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
}