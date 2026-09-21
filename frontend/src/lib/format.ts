export const soDigitos = (valor: string) => valor.replace(/\D/g, "");

// aplica a máscara (86) 99999-9999 enquanto a pessoa digita; aceita fixo (10 dígitos) e celular (11)
export function mascararTelefone(valor: string): string {
  const d = soDigitos(valor).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function linkWhatsapp(telefone: string): string {
  return `https://wa.me/55${soDigitos(telefone)}`;
}

export function formatarDataHora(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "—";
  const dia = data.toLocaleDateString("pt-BR");
  const hora = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${dia}, ${hora}`;
}

export function mesmoDia(iso: string, referencia: Date = new Date()): boolean {
  const data = new Date(iso);
  return data.toDateString() === referencia.toDateString();
}

export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

export function formatarReais(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
