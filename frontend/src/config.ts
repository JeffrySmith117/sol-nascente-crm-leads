import type { Unidade } from "./types";

export interface UnidadeInfo {
  id: Unidade;
  rotulo: string; // texto do <select> do formulário
  nome: string;
  tipo: "Matriz" | "Filial";
  endereco: string;
  horario: string;
  // mesmos horários acima, mas em números — usado para calcular "aberto agora" em tempo real.
  // Domingo fica de fora (loja fechada); os pares são [hora que abre, hora que fecha].
  horarioSemana: [number, number];
  horarioSabado: [number, number];
  // número no formato DDI+DDD+número (ex.: 5586912345678). Um valor padrão já fica aqui no
  // código (números públicos da loja); definir VITE_WHATSAPP_TERESINA/VITE_WHATSAPP_TIMON no
  // ambiente sobrescreve sem precisar mexer no código.
  whatsapp: string;
}

// (86) 2106-6500 e (99) 3118-6500 — telefones informados pela loja
const WHATSAPP_TERESINA_PADRAO = "558621066500";
const WHATSAPP_TIMON_PADRAO = "559931186500";

export const UNIDADES: Record<Unidade, UnidadeInfo> = {
  TERESINA: {
    id: "TERESINA",
    rotulo: "Teresina - PI",
    nome: "Unidade Teresina - PI",
    tipo: "Matriz",
    endereco: "Av. Frei Serafim, 2800 — Centro, Teresina - PI",
    horario: "Seg à Sex: 08:00 às 18:00 | Sáb: 08:00 às 12:00",
    horarioSemana: [8, 18],
    horarioSabado: [8, 12],
    whatsapp: import.meta.env.VITE_WHATSAPP_TERESINA ?? WHATSAPP_TERESINA_PADRAO,
  },
  TIMON: {
    id: "TIMON",
    rotulo: "Timon - MA",
    nome: "Unidade Timon - MA",
    tipo: "Filial",
    endereco: "Av. Presidente Médici, 1420 — Formosa, Timon - MA",
    horario: "Seg à Sex: 08:00 às 18:00 | Sáb: 08:00 às 12:00",
    horarioSemana: [8, 18],
    horarioSabado: [8, 12],
    whatsapp: import.meta.env.VITE_WHATSAPP_TIMON ?? WHATSAPP_TIMON_PADRAO,
  },
};

export type Categoria = "Urbanas" | "Scooter" | "Trail" | "Naked" | "Sport";

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
    parcela: 389.12,
    cor: "#2563EB",
  },
  {
    slug: "pcx",
    nome: "Honda PCX",
    selo: "PCX",
    categoria: "Scooter",
    situacao: "Em estoque",
    descricao: "Scooter premium com conforto, painel digital e ótima autonomia.",
    parcela: 360,
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
    parcela: 568.04,
    cor: "#B91C1C",
  },
  {
    slug: "xre-190",
    nome: "Honda XRE 190",
    selo: "XRE 190",
    categoria: "Trail",
    situacao: "Em estoque",
    descricao: "Trail versátil para cidade e estrada, com posição de pilotagem alta e confortável.",
    parcela: 420,
    cor: "#64748B",
  },
  {
    slug: "xre-300",
    nome: "Honda XRE 300",
    selo: "XRE 300",
    categoria: "Trail",
    situacao: "Em estoque",
    descricao: "Aventura de verdade: motor 300 cc, rodas raiadas e postura de trail.",
    parcela: 820,
    cor: "#B91C1C",
  },
  {
    slug: "nx-500",
    nome: "Honda NX 500",
    selo: "NX 500",
    categoria: "Trail",
    situacao: "Sob consulta",
    descricao: "Big trail de 500 cc: conforto para viagens longas e pegada de aventura.",
    parcela: 960,
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
  {
    // TODO: confirmar com a loja o nome exato desta versão da CBR (assumido CBR 650R pela foto)
    slug: "cbr-650r",
    nome: "Honda CBR 650R",
    selo: "CBR 650R",
    categoria: "Sport",
    situacao: "Sob consulta",
    descricao: "Esportiva de alta performance, com motor bicilíndrico e freios de série.",
    parcela: 1075,
    cor: "#DC2626",
  },
];

export const CATEGORIAS: Array<Categoria | "Todas"> = ["Todas", "Urbanas", "Scooter", "Trail", "Naked", "Sport"];

// modelos oferecidos no <select> do formulário
export const MODELOS_FORMULARIO: string[] = MOTOS.map((m) => m.nome);

// mesma lógica do link do WhatsApp, mas devolve null quando o número não foi configurado
export function linkWhatsappUnidade(unidade: UnidadeInfo, mensagem: string): string | null {
  const numero = unidade.whatsapp.replace(/\D/g, "");
  if (!numero) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export function linkLigarUnidade(unidade: UnidadeInfo): string {
  return `tel:+${unidade.whatsapp.replace(/\D/g, "")}`;
}

export function linkMapaUnidade(unidade: UnidadeInfo): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unidade.endereco)}`;
}

// true se a unidade está aberta agora, considerando o horário do navegador de quem acessa
// (assume fuso de Brasília, que é onde as duas lojas ficam). Domingo é sempre fechado.
export function abertaAgora(unidade: UnidadeInfo, agora: Date = new Date()): boolean {
  const dia = agora.getDay(); // 0 = domingo, 6 = sábado
  if (dia === 0) return false;
  const [abre, fecha] = dia === 6 ? unidade.horarioSabado : unidade.horarioSemana;
  const hora = agora.getHours() + agora.getMinutes() / 60;
  return hora >= abre && hora < fecha;
}
