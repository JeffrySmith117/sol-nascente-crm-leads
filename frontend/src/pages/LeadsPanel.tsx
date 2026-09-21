import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import {
  IconCheckCircle,
  IconChevronDown,
  IconDownload,
  IconGrid,
  IconInbox,
  IconLogOut,
  IconMessage,
  IconMoreVertical,
  IconPhoneCall,
  IconRefresh,
  IconSearch,
  IconTrendingUp,
  IconUser,
  IconUsers,
} from "../components/Icons";
import Logo from "../components/Logo";
import { UNIDADES } from "../config";
import { formatarDataHora, iniciais, linkWhatsapp, mascararTelefone, mesmoDia } from "../lib/format";
import type { Lead, StatusLead, Unidade } from "../types";

const STATUS_LABEL: Record<StatusLead, string> = {
  NOVO: "Novo",
  EM_CONTATO: "Em contato",
  CONVERTIDO: "Convertido",
  PERDIDO: "Perdido",
};

const STATUS_PILL: Record<StatusLead, string> = {
  NOVO: "bg-red-50 text-red-700",
  EM_CONTATO: "bg-indigo-50 text-indigo-700",
  CONVERTIDO: "bg-emerald-50 text-emerald-700",
  PERDIDO: "bg-slate-100 text-slate-600",
};

const STATUS_PONTO: Record<StatusLead, string> = {
  NOVO: "bg-red-500",
  EM_CONTATO: "bg-indigo-500",
  CONVERTIDO: "bg-emerald-500",
  PERDIDO: "bg-slate-400",
};

const STATUS_AVATAR: Record<StatusLead, string> = {
  NOVO: "bg-red-100 text-red-700",
  EM_CONTATO: "bg-indigo-100 text-indigo-700",
  CONVERTIDO: "bg-emerald-100 text-emerald-700",
  PERDIDO: "bg-slate-200 text-slate-600",
};

const TODOS_STATUS = Object.keys(STATUS_LABEL) as StatusLead[];
const INTERVALO_ATUALIZACAO_MS = 30000;

interface Filtros {
  busca: string;
  status: StatusLead | "TODOS";
  unidade: Unidade | "TODAS";
  modelo: string;
}

const FILTROS_INICIAIS: Filtros = { busca: "", status: "TODOS", unidade: "TODAS", modelo: "TODOS" };

function nomeUnidade(u: Unidade): string {
  return UNIDADES[u].rotulo.split(" - ")[0];
}

// ---------------------------------------------------------------- componentes de apresentação

interface KpiProps {
  titulo: string;
  valor: number;
  icone: ReactNode;
  corIcone: string;
  selo: string;
  corSelo: string;
  porcentagem: number;
  corBarra: string;
  corValor?: string;
}

function CardKpi({ titulo, valor, icone, corIcone, selo, corSelo, porcentagem, corBarra, corValor }: KpiProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-card">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{titulo}</p>
        <span className={`grid h-8 w-8 place-items-center rounded-lg text-base ${corIcone}`}>{icone}</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className={`text-3xl font-extrabold ${corValor ?? "text-ink"}`}>{valor}</p>
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${corSelo}`}>{selo}</span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full transition-all ${corBarra}`} style={{ width: `${porcentagem}%` }} />
      </div>
    </div>
  );
}

function SeletorStatus({ lead, aoMudar }: { lead: Lead; aoMudar: (status: StatusLead) => void }) {
  return (
    <span className={`relative inline-flex items-center rounded-full ${STATUS_PILL[lead.status]}`}>
      <span className={`pointer-events-none absolute left-2.5 h-1.5 w-1.5 rounded-full ${STATUS_PONTO[lead.status]}`} />
      <select
        aria-label={`Status de ${lead.nome}`}
        value={lead.status}
        onChange={(e) => aoMudar(e.target.value as StatusLead)}
        className="cursor-pointer appearance-none rounded-full bg-transparent py-1 pl-6 pr-6 text-[11px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        {TODOS_STATUS.map((s) => (
          <option key={s} value={s} className="text-ink">
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      <IconChevronDown className="pointer-events-none absolute right-2 h-3 w-3" />
    </span>
  );
}

interface MenuAcoesProps {
  lead: Lead;
  aberto: boolean;
  alternar: () => void;
  aoMudar: (status: StatusLead) => void;
}

function MenuAcoes({ lead, aberto, alternar, aoMudar }: MenuAcoesProps) {
  return (
    <div className="relative inline-block text-left" data-menu-acoes>
      <button
        type="button"
        onClick={alternar}
        aria-label={`Ações para ${lead.nome}`}
        aria-expanded={aberto}
        className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100"
      >
        <IconMoreVertical className="h-4 w-4" />
      </button>
      {aberto && (
        <div className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 text-sm shadow-lg">
          <a
            href={linkWhatsapp(lead.whatsapp)}
            target="_blank"
            rel="noreferrer"
            onClick={alternar}
            className="flex items-center gap-2 px-3 py-2 font-medium text-emerald-700 hover:bg-slate-50"
          >
            <IconMessage className="h-4 w-4" /> Chamar no WhatsApp
          </a>
          <div className="my-1 border-t border-slate-100" />
          {TODOS_STATUS.filter((s) => s !== lead.status).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                aoMudar(s);
                alternar();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
            >
              <span className={`h-2 w-2 rounded-full ${STATUS_PONTO[s]}`} />
              Marcar como {STATUS_LABEL[s].toLowerCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SelectFiltro({
  valor,
  aoMudar,
  children,
  rotulo,
}: {
  valor: string;
  aoMudar: (valor: string) => void;
  children: ReactNode;
  rotulo: string;
}) {
  return (
    <span className="relative block">
      <select
        aria-label={rotulo}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        className="w-full cursor-pointer appearance-none rounded-lg bg-chip px-3 py-2.5 pr-8 text-xs font-semibold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
      >
        {children}
      </select>
      <IconChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
    </span>
  );
}

// ---------------------------------------------------------------- exportação

function escaparCsv(valor: string): string {
  return `"${valor.replace(/"/g, '""')}"`;
}

function exportarCsv(leads: Lead[]) {
  const cabecalho = ["Nome", "WhatsApp", "Modelo de interesse", "Unidade", "Status", "Criado em"];
  const linhas = leads.map((l) =>
    [
      l.nome,
      mascararTelefone(l.whatsapp),
      l.modeloInteresse,
      nomeUnidade(l.unidade),
      STATUS_LABEL[l.status],
      formatarDataHora(l.criadoEm),
    ]
      .map(escaparCsv)
      .join(";")
  );
  // BOM + ponto e vírgula: o Excel em pt-BR abre acentos e colunas corretamente
  const conteudo = "﻿" + [cabecalho.map(escaparCsv).join(";"), ...linhas].join("\r\n");
  const url = URL.createObjectURL(new Blob([conteudo], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `leads-sol-nascente-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------- página

export default function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const navigate = useNavigate();
  const nomeUsuario = localStorage.getItem("nome") ?? "Administrador";

  // silencioso = atualização em segundo plano (não pisca a tela de "carregando")
  const carregar = useCallback((silencioso = false) => {
    if (!silencioso) setCarregando(true);
    setErro(null);
    api
      .get<Lead[]>("/leads")
      .then((r) => {
        setLeads(r.data);
        setAtualizadoEm(new Date());
      })
      .catch(() => {
        if (!silencioso) setErro("Não foi possível carregar os leads. Tente atualizar.");
      })
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
    const timer = window.setInterval(() => carregar(true), INTERVALO_ATUALIZACAO_MS);
    return () => window.clearInterval(timer);
  }, [carregar]);

  // fecha o menu de ações ao clicar fora dele
  const menuRef = useRef(menuAberto);
  menuRef.current = menuAberto;
  useEffect(() => {
    function aoClicar(e: MouseEvent) {
      if (menuRef.current === null) return;
      if (!(e.target as HTMLElement).closest("[data-menu-acoes]")) setMenuAberto(null);
    }
    document.addEventListener("click", aoClicar);
    return () => document.removeEventListener("click", aoClicar);
  }, []);

  async function mudarStatus(id: number, status: StatusLead) {
    setLeads((atual) => atual.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await api.patch(`/leads/${id}/status`, { status });
    } catch {
      carregar(true); // volta ao estado real do servidor se a troca falhar
    }
  }

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    localStorage.removeItem("perfil");
    navigate("/login");
  }

  const modelos = useMemo(
    () => Array.from(new Set(leads.map((l) => l.modeloInteresse.trim()).filter(Boolean))).sort(),
    [leads]
  );

  const filtrados = useMemo(() => {
    const busca = filtros.busca.trim().toLowerCase();
    const buscaDigitos = busca.replace(/\D/g, "");
    return leads
      .filter((l) => filtros.status === "TODOS" || l.status === filtros.status)
      .filter((l) => filtros.unidade === "TODAS" || l.unidade === filtros.unidade)
      .filter((l) => filtros.modelo === "TODOS" || l.modeloInteresse.trim() === filtros.modelo)
      .filter(
        (l) =>
          !busca ||
          l.nome.toLowerCase().includes(busca) ||
          (buscaDigitos.length > 0 && l.whatsapp.replace(/\D/g, "").includes(buscaDigitos))
      )
      .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
  }, [leads, filtros]);

  const total = leads.length;
  const contagem = (s: StatusLead) => leads.filter((l) => l.status === s).length;
  const novos = contagem("NOVO");
  const emContato = contagem("EM_CONTATO");
  const convertidos = contagem("CONVERTIDO");
  const hoje = leads.filter((l) => mesmoDia(l.criadoEm)).length;
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));
  const filtrosAtivos =
    filtros.busca !== "" || filtros.status !== "TODOS" || filtros.unidade !== "TODAS" || filtros.modelo !== "TODOS";

  return (
    <div className="min-h-screen md:pl-56">
      {/* ===== barra lateral (desktop) ===== */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 flex-col border-r border-slate-200 bg-white p-4 md:flex">
        <Logo />
        <nav className="mt-8">
          <span className="flex items-center gap-2 rounded-lg bg-brand px-3 py-2.5 text-sm font-semibold text-white shadow-sm">
            <IconGrid className="h-4 w-4" /> Dashboard
          </span>
        </nav>
        <div className="mt-auto rounded-xl bg-surface p-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink text-xs font-bold text-white">
              {iniciais(nomeUsuario)}
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold">{nomeUsuario}</p>
              <p className="text-[11px] text-slate-500">Administrador</p>
            </div>
          </div>
          <button
            type="button"
            onClick={sair}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
          >
            <IconLogOut className="h-3.5 w-3.5" /> Sair
          </button>
        </div>
      </aside>

      {/* ===== topo (mobile) ===== */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <Logo />
        <button type="button" onClick={sair} className="flex items-center gap-1.5 text-xs font-semibold text-brand">
          <IconLogOut className="h-4 w-4" /> Sair
        </button>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 p-4 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold">Dashboard</h1>
            <p className="text-sm text-slate-500">Acompanhe e gerencie seus leads em tempo real.</p>
          </div>
          <div className="flex items-center gap-3">
            {atualizadoEm && (
              <span className="hidden text-[11px] text-slate-400 sm:block">
                Atualizado às {atualizadoEm.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <button
              type="button"
              onClick={() => carregar()}
              aria-label="Atualizar leads"
              className="grid h-9 w-9 place-items-center rounded-lg bg-white text-slate-600 shadow-card transition hover:text-brand"
            >
              <IconRefresh className={`h-4 w-4 ${carregando ? "animate-spin" : ""}`} />
            </button>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white" title={nomeUsuario}>
              <IconUser className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* ===== indicadores ===== */}
        <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <CardKpi
            titulo="Total de leads"
            valor={total}
            icone={<IconUsers />}
            corIcone="bg-slate-100 text-slate-600"
            selo={hoje > 0 ? `+${hoje} hoje` : "nenhum hoje"}
            corSelo="bg-emerald-50 text-emerald-700"
            porcentagem={total === 0 ? 0 : 100}
            corBarra="bg-ink"
          />
          <CardKpi
            titulo="Novos"
            valor={novos}
            icone={<IconInbox />}
            corIcone="bg-red-50 text-red-600"
            selo="Ação prioritária"
            corSelo="bg-red-50 text-red-600"
            porcentagem={pct(novos)}
            corBarra="bg-brand"
            corValor="text-brand"
          />
          <CardKpi
            titulo="Em contato"
            valor={emContato}
            icone={<IconPhoneCall />}
            corIcone="bg-indigo-50 text-indigo-600"
            selo="Em negociação"
            corSelo="bg-indigo-50 text-indigo-600"
            porcentagem={pct(emContato)}
            corBarra="bg-indigo-500"
          />
          <CardKpi
            titulo="Convertidos"
            valor={convertidos}
            icone={<IconCheckCircle />}
            corIcone="bg-emerald-50 text-emerald-600"
            selo="Faturados"
            corSelo="bg-emerald-50 text-emerald-700"
            porcentagem={pct(convertidos)}
            corBarra="bg-emerald-500"
          />
        </section>

        {/* ===== tabela de leads ===== */}
        <section className="rounded-2xl bg-white p-4 shadow-card md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold">Leads</h2>
              <p className="text-xs text-slate-500">Gerencie os leads recebidos pela concessionária Sol Nascente.</p>
            </div>
            <button
              type="button"
              onClick={() => exportarCsv(filtrados)}
              disabled={filtrados.length === 0}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IconDownload className="h-4 w-4" /> Exportar
            </button>
          </div>

          <div className="mt-4 grid gap-2 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <label className="relative block">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={filtros.busca}
                onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                placeholder="Buscar por nome ou WhatsApp..."
                aria-label="Buscar por nome ou WhatsApp"
                className="w-full rounded-lg bg-chip py-2.5 pl-9 pr-3 text-xs text-ink outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-brand/30"
              />
            </label>
            <SelectFiltro
              rotulo="Filtrar por status"
              valor={filtros.status}
              aoMudar={(v) => setFiltros({ ...filtros, status: v as Filtros["status"] })}
            >
              <option value="TODOS">Todos os status</option>
              {TODOS_STATUS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </SelectFiltro>
            <SelectFiltro
              rotulo="Filtrar por unidade"
              valor={filtros.unidade}
              aoMudar={(v) => setFiltros({ ...filtros, unidade: v as Filtros["unidade"] })}
            >
              <option value="TODAS">Todas as unidades</option>
              {(Object.keys(UNIDADES) as Unidade[]).map((u) => (
                <option key={u} value={u}>
                  {nomeUnidade(u)}
                </option>
              ))}
            </SelectFiltro>
            <SelectFiltro
              rotulo="Filtrar por modelo"
              valor={filtros.modelo}
              aoMudar={(v) => setFiltros({ ...filtros, modelo: v })}
            >
              <option value="TODOS">Todos os modelos</option>
              {modelos.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </SelectFiltro>
          </div>

          {erro && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {erro}
            </p>
          )}

          {/* tabela (telas médias e grandes) */}
          <div className="mt-4 hidden overflow-x-auto lg:block">
            <table className="w-full text-left text-sm [&_td]:whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-2 pr-3">Lead</th>
                  <th className="px-3 py-2">WhatsApp</th>
                  <th className="px-3 py-2">Modelo de interesse</th>
                  <th className="px-3 py-2">Unidade</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Criado em</th>
                  <th className="py-2 pl-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-bold ${STATUS_AVATAR[lead.status]}`}
                        >
                          {iniciais(lead.nome)}
                        </span>
                        <span className="font-semibold">{lead.nome}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <a
                        href={linkWhatsapp(lead.whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-emerald-700"
                      >
                        <IconMessage className="h-4 w-4 text-emerald-600" />
                        {mascararTelefone(lead.whatsapp)}
                      </a>
                    </td>
                    <td className="px-3 py-3">
                      <span className="rounded bg-ink px-2 py-1 text-[10px] font-bold text-white">
                        {lead.modeloInteresse}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600">{nomeUnidade(lead.unidade)}</td>
                    <td className="px-3 py-3">
                      <SeletorStatus lead={lead} aoMudar={(s) => mudarStatus(lead.id, s)} />
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-500">{formatarDataHora(lead.criadoEm)}</td>
                    <td className="py-3 pl-3 text-right">
                      <MenuAcoes
                        lead={lead}
                        aberto={menuAberto === lead.id}
                        alternar={() => setMenuAberto(menuAberto === lead.id ? null : lead.id)}
                        aoMudar={(s) => mudarStatus(lead.id, s)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* cartões (celular) */}
          <ul className="mt-4 space-y-3 lg:hidden">
            {filtrados.map((lead) => (
              <li key={lead.id} className="rounded-xl border border-slate-100 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-bold ${STATUS_AVATAR[lead.status]}`}
                    >
                      {iniciais(lead.nome)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{lead.nome}</p>
                      <a
                        href={linkWhatsapp(lead.whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-emerald-700"
                      >
                        <IconMessage className="h-3.5 w-3.5" /> {mascararTelefone(lead.whatsapp)}
                      </a>
                    </div>
                  </div>
                  <MenuAcoes
                    lead={lead}
                    aberto={menuAberto === lead.id}
                    alternar={() => setMenuAberto(menuAberto === lead.id ? null : lead.id)}
                    aoMudar={(s) => mudarStatus(lead.id, s)}
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="rounded bg-ink px-2 py-1 text-[10px] font-bold text-white">
                    {lead.modeloInteresse}
                  </span>
                  <span>{nomeUnidade(lead.unidade)}</span>
                  <span>•</span>
                  <span>{formatarDataHora(lead.criadoEm)}</span>
                </div>
                <div className="mt-3">
                  <SeletorStatus lead={lead} aoMudar={(s) => mudarStatus(lead.id, s)} />
                </div>
              </li>
            ))}
          </ul>

          {carregando && leads.length === 0 && <p className="py-8 text-center text-sm text-slate-500">Carregando...</p>}
          {!carregando && !erro && filtrados.length === 0 && (
            <div className="py-10 text-center text-sm text-slate-500">
              <IconTrendingUp className="mx-auto mb-2 h-6 w-6 text-slate-300" />
              {filtrosAtivos ? (
                <>
                  Nenhum lead encontrado com esses filtros.{" "}
                  <button
                    type="button"
                    onClick={() => setFiltros(FILTROS_INICIAIS)}
                    className="font-semibold text-brand hover:underline"
                  >
                    Limpar filtros
                  </button>
                </>
              ) : (
                "Nenhum lead por aqui ainda."
              )}
            </div>
          )}

          {filtrados.length > 0 && (
            <p className="mt-4 text-[11px] text-slate-400">
              Mostrando {filtrados.length} de {total} leads
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
