import type { Unidade } from "./types";

export interface UnidadeInfo {
  id: Unidade;
  rotulo: string; // texto do <select> do formulário
  nome: string;
  tipo: "Matriz" | "Filial";
  endereco: string;
  horario: string;
  // número no formato DDI+DDD+número (ex.: 5586912345678), vindo do ambiente. Se não estiver
  // configurado, os botões de WhatsApp levam para o formulário em vez de abrir uma conversa.
  whatsapp: string;
}

export const UNIDADES: Record<Unidade, UnidadeInfo> = {
  TERESINA: {
    id: "TERESINA",
    rotulo: "Teresina - PI",
    nome: "Unidade Teresina - PI",
    tipo: "Matriz",
    endereco: "Av. Frei Serafim, 2800 — Centro, Teresina - PI",
    horario: "Seg à Sex: 08:00 às 18:00 | Sáb: 08:00 às 12:00",
    whatsapp: import.meta.env.VITE_WHATSAPP_TERESINA ?? "",
  },
  TIMON: {
    id: "TIMON",
    rotulo: "Timon - MA",
    nome: "Unidade Timon - MA",
    tipo: "Filial",
    endereco: "Av. Presidente Médici, 1420 — Formosa, Timon - MA",
    horario: "Seg à Sex: 08:00 às 18:00 | Sáb: 08:00 às 12:00",
    whatsapp: import.meta.env.VITE_WHATSAPP_TIMON ?? "",
  },
};

export interface MotoDestaque {
  nome: string; // valor enviado no campo "modeloInteresse"
  selo: string;
  situacao: string;
  descricao: string;
  parcela: number;
  cor: string; // cor principal da ilustração
}

export const MOTOS_DESTAQUE: MotoDestaque[] = [
  {
    nome: "Honda CG 160",
    selo: "CG 160 Titan",
    situacao: "Em Estoque",
    descricao: "A motocicleta mais vendida do Brasil, econômica e robusta.",
    parcela: 389,
    cor: "#C8102E",
  },
  {
    nome: "Honda Biz",
    selo: "Biz 125",
    situacao: "Pronta Entrega",
    descricao: "Praticidade com porta-capacete e câmbio semiautomático.",
    parcela: 349,
    cor: "#B4142B",
  },
  {
    nome: "Honda NXR 160 Bros",
    selo: "Bros 160 ABS",
    situacao: "Últimas Unidades",
    descricao: "Suspensão de longo curso para qualquer tipo de terreno.",
    parcela: 459,
    cor: "#D6321F",
  },
  {
    nome: "Honda CB 300F",
    selo: "Twister 2025",
    situacao: "Lançamento",
    descricao: "Design esportivo, embreagem assistida e iluminação full LED.",
    parcela: 549,
    cor: "#1E3A8A",
  },
];

// modelos oferecidos no <select> do formulário: os destaques e mais alguns da linha
export const MODELOS_FORMULARIO: string[] = [
  ...MOTOS_DESTAQUE.map((m) => m.nome),
  "Honda Pop 110i",
  "Honda PCX",
  "Honda XRE 300",
];

// mesma lógica do link do WhatsApp, mas devolve null quando o número não foi configurado
export function linkWhatsappUnidade(unidade: UnidadeInfo, mensagem: string): string | null {
  const numero = unidade.whatsapp.replace(/\D/g, "");
  if (!numero) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
