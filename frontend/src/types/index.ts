export type Unidade = "TERESINA" | "TIMON";
export type StatusLead = "NOVO" | "EM_CONTATO" | "CONVERTIDO" | "PERDIDO";

export interface Lead {
  id: number;
  nome: string;
  whatsapp: string;
  modeloInteresse: string;
  unidade: Unidade;
  status: StatusLead;
  criadoEm: string; // ISO datetime
}

export interface NovoLeadRequest {
  nome: string;
  whatsapp: string;
  modeloInteresse: string;
  unidade: Unidade;
}

export interface TokenResponse {
  token: string;
  nome: string;
  perfil: "ADMIN";
}