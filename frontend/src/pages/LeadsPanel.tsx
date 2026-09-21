import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { BarrasHorizontais, GraficoBarrasDia, GraficoRosca } from "../components/Graficos";
import {
  IconChevronDown,
  IconDownload,
  IconKanban,
  IconList,
  IconLogOut,
  IconMessage,
  IconMoreVertical,
  IconRefresh,
  IconSearch,
} from "../components/Icons";
import Logo from "../components/Logo";
import { MarcaDagua, Mascote } from "../components/Marca";
import { UNIDADES } from "../config";
import { formatarDataHora, iniciais, linkWhatsapp, mascararTelefone, mesmoDia } from "../lib/format";
import type { Lead, StatusLead, Unidade } from "../types";

const STATUS_LABEL: Record<StatusLead, string> = {
  NOVO: "Novo",
  EM_CONTATO: "Em contato",
  CONVERTIDO: "Convertido",
  PERDIDO: "Perdido",
};

// cores de cada etapa: classes do Tailwind (telas) e hex (gráficos SVG)
const STATUS_COR: Record<StatusLead, { barra: string; pilula: string; texto: string; hex: string }> = {
  NOVO: { barra: "bg-brand", pilula: "bg-red-50 text-red-700", texto: "text-brand", hex: "#E10A2B" },
  EM_CONTATO: { barra: "bg-sky-500", pilula: "bg-sky-50 text-sky-700", texto: "text-sky-600", hex: "#0EA5E9" },
  CONVERTIDO: {
    barra: "bg-emerald-500",
    pilula: "bg-emerald-50 text-emerald-700",
    texto: "text-emerald-600",
    hex: "#10B981",
  },
  PERDIDO: { barra: "bg-slate-400", pilula: "bg-slate-100 text-slate-600", texto: "text-slate-500", hex: "#94A3B8" },
};

const TODOS_STATUS = Object.keys(STATUS_LABEL) as StatusLead[];
const INTERVALO_ATUALIZACAO_MS = 30000;
const PAINEL = "rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur-sm";

type Visao = "quadro" | "lista";

interface Filtros {
  busca: string;
  unidade: Unidade | "TODAS";
  modelo: string;
}

const FILTROS_INICIAIS: Filtros = { busca: "", unidade: "TODAS", modelo: "TODOS" };

function nomeUnidade(u: Unidade): string {
  return UNIDADES[u].rotulo.split(" - ")[0];
}

// ---------------------------------------------------------------- pedaços da tela

function CardKpi({
  titulo,
  valor,
  detalhe,
  barra,
  corValor = "text-slate-900",
}: {
  titulo: string;
  valor: number;
  detalhe: string;
  barra: string;
  corValor?: string;
}) {
  return (
    <div className={`${PAINEL} relative overflow-hidden p-4`}>
      <span className={`absolute inset-x-0 top-0 h-1 ${barra}`} />
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{titulo}</p>
      <p className={`titulo mt-1 text-5xl leading-none ${corValor}`}>{valor}</p>
      <p className="mt-1 text-[11px] text-slate-500">{detalhe}</p>
    </div>
  );
}

function CartaoGrafico({
  titulo,
  subtitulo,
  children,
  className = "",
}: {
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${PAINEL} p-4 ${className}`}>
      <h2 className="titulo text-xl text-slate-900">{titulo}</h2>
      {subtitulo && <p className="mb-3 text-[11px] text-slate-500">{subtitulo}</p>}
      {children}
    </section>
  );
}

function SeletorStatus({ lead, aoMudar }: { lead: Lead; aoMudar: (status: StatusLead) => void }) {
  return (
    <span className={`relative inline-flex items-center rounded-full ${STATUS_COR[lead.status].pilula}`}>
      <select
        aria-label={`Status de ${lead.nome}`}
        value={lead.status}
        onChange={(e) => aoMudar(e.target.value as StatusLead)}
        className="cursor-pointer appearance-none rounded-full bg-transparent py-1 pl-3 pr-6 text-[11px] font-bold outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        {TODOS_STATUS.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      <IconChevronDown className="pointer-events-none absolute right-2 h-3 w-3" />
    </span>
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
        className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-8 text-xs font-semibold text-slate-700 outline-none transition focus:border-brand"
      >
        {children}
      </select>
      <IconChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
    </span>
  );
}

function MenuAcoes({
  lead,
  aberto,
  alternar,
  aoMudar,
}: {
  lead: Lead;
  aberto: boolean;
  alternar: () => void;
  aoMudar: (status: StatusLead) => void;
}) {
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
              <span className={`h-2 w-2 rounded-full ${STATUS_COR[s].barra}`} />
              Marcar como {STATUS_LABEL[s].toLowerCase()}
            </button>
          ))}
        </div>
      )}
    </div>
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
  const [visao, setVisao] = useState<Visao>(() => (localStorage.getItem("visao") === "lista" ? "lista" : "quadro"));
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [arrastando, setArrastando] = useState<number | null>(null);
  const [colunaAlvo, setColunaAlvo] = useState<StatusLead | null>(null);
  const navigate = useNavigate();
  const nomeUsuario = localStorage.getItem("nome") ?? "Administrador";
  const primeiroNome = nomeUsuario.split(" ")[0];

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

  function trocarVisao(nova: Visao) {
    setVisao(nova);
    try {
      localStorage.setItem("visao", nova);
    } catch {
      /* preferência é só conveniência: se o navegador bloquear o storage, segue sem salvar */
    }
  }

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

  // arrastar e soltar do quadro
  function aoSoltar(e: DragEvent, status: StatusLead) {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData("text/plain"));
    setColunaAlvo(null);
    setArrastando(null);
    const lead = leads.find((l) => l.id === id);
    if (lead && lead.status !== status) mudarStatus(id, status);
  }

  const modelos = useMemo(
    () => Array.from(new Set(leads.map((l) => l.modeloInteresse.trim()).filter(Boolean))).sort(),
    [leads]
  );

  const filtrados = useMemo(() => {
    const busca = filtros.busca.trim().toLowerCase();
    const buscaDigitos = busca.replace(/\D/g, "");
    return leads
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

  const porStatus = (s: StatusLead) => filtrados.filter((l) => l.status === s);
  const total = filtrados.length;
  const novos = porStatus("NOVO").length;
  const emContato = porStatus("EM_CONTATO").length;
  const convertidos = porStatus("CONVERTIDO").length;
  const hoje = filtrados.filter((l) => mesmoDia(l.criadoEm)).length;
  const taxaConversao = total === 0 ? 0 : Math.round((convertidos / total) * 100);
  const filtrosAtivos = filtros.busca !== "" || filtros.unidade !== "TODAS" || filtros.modelo !== "TODOS";

  // dados dos gráficos (sempre refletem os filtros ativos)
  const topModelos = useMemo(() => {
    const contagem = new Map<string, number>();
    for (const l of filtrados) {
      const m = l.modeloInteresse.trim();
      contagem.set(m, (contagem.get(m) ?? 0) + 1);
    }
    return Array.from(contagem, ([rotulo, valor]) => ({ rotulo, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5);
  }, [filtrados]);

  const porUnidade = (Object.keys(UNIDADES) as Unidade[]).map((u) => ({
    rotulo: nomeUnidade(u),
    valor: filtrados.filter((l) => l.unidade === u).length,
  }));

  return (
    <div className="tema-claro relative min-h-screen bg-white">
      <MarcaDagua />

      {/* ===== menu superior ===== */}
      <header className="sticky top-0 z-30 border-b-4 border-brand bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5">
          <Logo tema="claro" imagem />
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
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-brand hover:text-brand"
            >
              <IconRefresh className={`h-4 w-4 ${carregando ? "animate-spin" : ""}`} />
            </button>
            <div className="hidden items-center gap-2 border-l border-slate-200 pl-3 sm:flex">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-xs font-bold text-white">
                {iniciais(nomeUsuario)}
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-900">{nomeUsuario}</p>
                <p className="text-[10px] text-slate-500">Administrador</p>
              </div>
            </div>
            <button
              type="button"
              onClick={sair}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-brand"
            >
              <IconLogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl space-y-5 px-4 py-6">
        {/* ===== boas-vindas com o mascote ===== */}
        <section className="listras relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-dark via-brand to-brand-soft px-6 py-6 text-white shadow-md sm:px-8">
          <div className="relative z-10 max-w-xl pr-28 sm:pr-40">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/80">Central de atendimento</p>
            <h1 className="titulo text-4xl sm:text-5xl">Olá, {primeiroNome}!</h1>
            <p className="mt-1 text-sm text-white/90">
              {novos > 0
                ? `Você tem ${novos} ${novos === 1 ? "lead novo aguardando" : "leads novos aguardando"} contato.`
                : "Nenhum lead novo no momento. Bom trabalho!"}
              {hoje > 0 && ` Hoje já chegaram ${hoje}.`}
            </p>
          </div>
          <Mascote className="absolute bottom-0 right-3 h-36 w-auto object-contain drop-shadow-xl sm:right-8 sm:h-44" />
        </section>

        {/* ===== indicadores ===== */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <CardKpi
            titulo="Total de leads"
            valor={total}
            detalhe={hoje > 0 ? `+${hoje} recebidos hoje` : "nenhum recebido hoje"}
            barra="bg-slate-800"
          />
          <CardKpi
            titulo="Novos"
            valor={novos}
            detalhe="Ação prioritária"
            barra={STATUS_COR.NOVO.barra}
            corValor={STATUS_COR.NOVO.texto}
          />
          <CardKpi
            titulo="Em contato"
            valor={emContato}
            detalhe="Em negociação"
            barra={STATUS_COR.EM_CONTATO.barra}
            corValor={STATUS_COR.EM_CONTATO.texto}
          />
          <CardKpi
            titulo="Convertidos"
            valor={convertidos}
            detalhe={`Taxa de conversão: ${taxaConversao}%`}
            barra={STATUS_COR.CONVERTIDO.barra}
            corValor={STATUS_COR.CONVERTIDO.texto}
          />
        </section>

        {/* ===== gráficos ===== */}
        <div className="grid gap-4 lg:grid-cols-3">
          <CartaoGrafico
            titulo="Leads por dia"
            subtitulo="Leads recebidos nos últimos dias"
            className="lg:col-span-2"
          >
            <GraficoBarrasDia datas={filtrados.map((l) => l.criadoEm)} />
          </CartaoGrafico>
          <CartaoGrafico titulo="Funil por status" subtitulo="Distribuição dos leads">
            <GraficoRosca
              rotuloCentro="leads"
              segmentos={TODOS_STATUS.map((s) => ({
                rotulo: STATUS_LABEL[s],
                valor: porStatus(s).length,
                cor: STATUS_COR[s].hex,
              }))}
            />
          </CartaoGrafico>
          <CartaoGrafico titulo="Modelos mais procurados" subtitulo="Top 5 por número de leads" className="lg:col-span-2">
            <BarrasHorizontais itens={topModelos} />
          </CartaoGrafico>
          <CartaoGrafico titulo="Por unidade" subtitulo="Origem dos leads">
            <BarrasHorizontais itens={porUnidade} cor="#0F172A" />
          </CartaoGrafico>
        </div>

        {/* ===== leads ===== */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="titulo text-3xl text-slate-900">Leads</h2>
              <p className="text-xs text-slate-500">Gerencie os contatos recebidos pela concessionária Sol Nascente.</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="flex rounded-lg border border-slate-200 bg-white p-0.5"
                role="group"
                aria-label="Modo de visualização"
              >
                {(
                  [
                    ["quadro", "Quadro", IconKanban],
                    ["lista", "Lista", IconList],
                  ] as const
                ).map(([id, rotulo, Icone]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => trocarVisao(id)}
                    aria-pressed={visao === id}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
                      visao === id ? "bg-brand text-white" : "text-slate-600 hover:text-brand"
                    }`}
                  >
                    <Icone className="h-4 w-4" /> {rotulo}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => exportarCsv(filtrados)}
                disabled={filtrados.length === 0}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
              >
                <IconDownload className="h-4 w-4" /> Exportar
              </button>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-[1.6fr_1fr_1fr]">
            <label className="relative block">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={filtros.busca}
                onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                placeholder="Buscar por nome ou WhatsApp..."
                aria-label="Buscar por nome ou WhatsApp"
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand"
              />
            </label>
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
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {erro}
            </p>
          )}
          {carregando && leads.length === 0 && <p className="py-10 text-center text-sm text-slate-500">Carregando...</p>}
          {!carregando && !erro && filtrados.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white/80 py-12 text-center text-sm text-slate-500">
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

          {/* ===== quadro (kanban) ===== */}
          {visao === "quadro" && filtrados.length > 0 && (
            <div className="grid auto-cols-[minmax(270px,1fr)] grid-flow-col gap-3 overflow-x-auto pb-2">
              {TODOS_STATUS.map((status) => {
                const itens = porStatus(status);
                const alvo = colunaAlvo === status;
                return (
                  <div
                    key={status}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (colunaAlvo !== status) setColunaAlvo(status);
                    }}
                    onDragLeave={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) setColunaAlvo(null);
                    }}
                    onDrop={(e) => aoSoltar(e, status)}
                    className={`rounded-xl border p-3 transition ${
                      alvo ? "border-brand bg-brand/5" : "border-slate-200 bg-slate-50/90"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-700">
                        <span className={`h-2.5 w-2.5 rounded-full ${STATUS_COR[status].barra}`} />
                        {STATUS_LABEL[status]}
                      </h3>
                      <span className={`titulo text-2xl leading-none ${STATUS_COR[status].texto}`}>{itens.length}</span>
                    </div>

                    <ul className="space-y-2.5">
                      {itens.map((lead) => (
                        <li
                          key={lead.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", String(lead.id));
                            e.dataTransfer.effectAllowed = "move";
                            setArrastando(lead.id);
                          }}
                          onDragEnd={() => {
                            setArrastando(null);
                            setColunaAlvo(null);
                          }}
                          className={`cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition active:cursor-grabbing ${
                            arrastando === lead.id ? "opacity-40" : "hover:border-brand/40 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold leading-tight text-slate-900">{lead.nome}</p>
                            <a
                              href={linkWhatsapp(lead.whatsapp)}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Chamar ${lead.nome} no WhatsApp`}
                              className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-600 transition hover:bg-emerald-500 hover:text-white"
                            >
                              <IconMessage className="h-4 w-4" />
                            </a>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">{mascararTelefone(lead.whatsapp)}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                            <span className="rounded bg-red-50 px-1.5 py-0.5 text-brand">{lead.modeloInteresse}</span>
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">
                              {nomeUnidade(lead.unidade)}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <span className="text-[10px] text-slate-400">{formatarDataHora(lead.criadoEm)}</span>
                            <SeletorStatus lead={lead} aoMudar={(s) => mudarStatus(lead.id, s)} />
                          </div>
                        </li>
                      ))}
                      {itens.length === 0 && (
                        <li className="rounded-lg border border-dashed border-slate-300 py-6 text-center text-[11px] text-slate-400">
                          Solte um lead aqui
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          {/* ===== lista ===== */}
          {visao === "lista" && filtrados.length > 0 && (
            <div className={`${PAINEL} overflow-x-auto`}>
              <table className="w-full text-left text-sm [&_td]:whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <th className="px-4 py-3">Lead</th>
                    <th className="px-3 py-3">WhatsApp</th>
                    <th className="px-3 py-3">Modelo</th>
                    <th className="px-3 py-3">Unidade</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Criado em</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-bold ${STATUS_COR[lead.status].pilula}`}
                          >
                            {iniciais(lead.nome)}
                          </span>
                          <span className="font-semibold text-slate-900">{lead.nome}</span>
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
                        <span className="rounded bg-red-50 px-2 py-1 text-[10px] font-bold text-brand">
                          {lead.modeloInteresse}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-600">{nomeUnidade(lead.unidade)}</td>
                      <td className="px-3 py-3">
                        <SeletorStatus lead={lead} aoMudar={(s) => mudarStatus(lead.id, s)} />
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500">{formatarDataHora(lead.criadoEm)}</td>
                      <td className="px-4 py-3 text-right">
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
          )}

          {filtrados.length > 0 && (
            <p className="text-[11px] text-slate-400">
              Mostrando {filtrados.length} de {leads.length} leads
              {visao === "quadro" && " • arraste os cartões entre as colunas para mudar o status"}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
