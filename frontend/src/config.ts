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

export type Categoria = "Urbanas" | "Scooter" | "Trail" | "Naked";

export interface Moto {
  slug: string; // nome do arquivo da foto em /public/motos/<slug>.webp (ou .png/.jpg)
  nome: string; // valor enviado no campo "modeloInteresse"
  selo: string;
  categoria: Categoria;
  situacao: string;
  descricao: string;
  // só preenchido onde a loja informou um valor; nos demais o card mostra "consulte as condições"
  parcela?: number;
  cor: string; // cor da ilustração usada enquanto a foto real não existe
}

// linha atual de motos Honda no Brasil (as fotos reais entram em /public/motos, ver README da pasta)
export const MOTOS: Moto[] = [
  {
    slug: "cg-160-titan",
    nome: "Honda CG 160 Titan",
    selo: "CG 160",
    categoria: "Urbanas",
    situacao: "Em estoque",
    descricao: "A motocicleta mais vendida do Brasil, econômica e robusta.",
    parcela: 389,
    cor: "#E10A2B",
  },
  {
    slug: "biz-125",
    nome: "Honda Biz 125",
    selo: "Biz 125",
    categoria: "Urbanas",
    situacao: "Pronta entrega",
    descricao: "Praticidade com porta-capacete e câmbio semiautomático.",
    parcela: 349,
    cor: "#C40D28",
  },
  {
    slug: "pop-110i",
    nome: "Honda Pop 110i",
    selo: "Pop 110i",
    categoria: "Urbanas",
    situacao: "Em estoque",
    descricao: "Porta de entrada da linha: leve, econômica e ideal para o dia a dia.",
    cor: "#2563EB",
  },
  {
    slug: "pcx",
    nome: "Honda PCX",
    selo: "PCX",
    categoria: "Scooter",
    situacao: "Em estoque",
    descricao: "Scooter premium com conforto, painel digital e ótima autonomia.",
    cor: "#92400E",
  },
  {
    slug: "nxr-160-bros",
    nome: "Honda NXR 160 Bros",
    selo: "Bros 160 ABS",
    categoria: "Trail",
    situacao: "Últimas unidades",
    descricao: "Suspensão de longo curso para qualquer tipo de terreno.",
    parcela: 459,
    cor: "#EA580C",
  },
  {
    slug: "xr-300l-tornado",
    nome: "Honda XR 300L Tornado",
    selo: "XR 300L Tornado",
    categoria: "Trail",
    situacao: "Em estoque",
    descricao: "Trail 300 cc com visual de competição e suspensão de longo curso.",
    cor: "#B91C1C",
  },
  {
    slug: "xre-190",
    nome: "Honda XRE 190",
    selo: "XRE 190",
    categoria: "Trail",
    situacao: "Em estoque",
    descricao: "Trail versátil para cidade e estrada, com posição de pilotagem alta e confortável.",
    cor: "#64748B",
  },
  {
    slug: "xre-300",
    nome: "Honda XRE 300",
    selo: "XRE 300",
    categoria: "Trail",
    situacao: "Em estoque",
    descricao: "Aventura de verdade: motor 300 cc, rodas raiadas e postura de trail.",
    cor: "#B91C1C",
  },
  {
    slug: "nx-500",
    nome: "Honda NX 500",
    selo: "NX 500",
    categoria: "Trail",
    situacao: "Sob consulta",
    descricao: "Big trail de 500 cc: conforto para viagens longas e pegada de aventura.",
    cor: "#94A3B8",
  },
  {
    slug: "cb-300f-twister",
    nome: "Honda CB 300F Twister",
    selo: "Twister",
    categoria: "Naked",
    situacao: "Lançamento",
    descricao: "Design esportivo, embreagem assistida e iluminação full LED.",
    parcela: 549,
    cor: "#1E3A8A",
  },
];

export const CATEGORIAS: Array<Categoria | "Todas"> = ["Todas", "Urbanas", "Scooter", "Trail", "Naked"];

// modelos oferecidos no <select> do formulário
export const MODELOS_FORMULARIO: string[] = MOTOS.map((m) => m.nome);

// mesma lógica do link do WhatsApp, mas devolve null quando o número não foi configurado
export function linkWhatsappUnidade(unidade: UnidadeInfo, mensagem: string): string | null {
  const numero = unidade.whatsapp.replace(/\D/g, "");
  if (!numero) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
