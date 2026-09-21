import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { aquecerApi } from "../api/client";
import { IconArrowRight, IconClock, IconLock, IconMapPin, IconMessage, IconShieldCheck } from "../components/Icons";
import Logo from "../components/Logo";
import MotoFoto from "../components/MotoFoto";
import ProposalForm from "../components/ProposalForm";
import { CATEGORIAS, linkWhatsappUnidade, MOTOS, UNIDADES } from "../config";
import type { Categoria } from "../config";
import { formatarReais } from "../lib/format";

const NUMEROS = [
  { valor: "5 min", legenda: "Tempo médio de primeiro contato" },
  { valor: "0%", legenda: "Taxa em planos de consórcio contemplados" },
  { valor: "Nº 1", legenda: "Maior estoque do Piauí e Maranhão" },
];

const ETAPAS = [
  {
    titulo: "Envie seus dados",
    texto: "Nome, WhatsApp e o modelo que você quer. Leva menos de um minuto.",
  },
  {
    titulo: "Um consultor chama você",
    texto: "Atendimento oficial pelo WhatsApp, em média em 5 minutos.",
  },
  {
    titulo: "Simulação e test-ride",
    texto: "Receba a simulação das parcelas e agende o test-ride em Teresina ou Timon.",
  },
];

export default function Landing() {
  const [modeloEscolhido, setModeloEscolhido] = useState("");
  const [categoria, setCategoria] = useState<Categoria | "Todas">("Todas");
  const propostaRef = useRef<HTMLElement>(null);

  // começa a acordar o backend (plano gratuito do Render) enquanto a pessoa lê a página
  useEffect(() => {
    aquecerApi();
  }, []);

  function irParaProposta(modelo?: string) {
    if (modelo) setModeloEscolhido(modelo);
    propostaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const motosVisiveis = useMemo(
    () => MOTOS.filter((m) => categoria === "Todas" || m.categoria === categoria),
    [categoria]
  );

  const linkPlantao = linkWhatsappUnidade(UNIDADES.TERESINA, "Olá! Gostaria de atendimento sobre motos Honda.");

  return (
    <div className="min-h-screen overflow-x-clip bg-night">
      {/* ===== navbar ===== */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-night/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" aria-label="Sol Nascente Motos Honda">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-white/70 md:flex">
            <a href="#modelos" className="transition hover:text-white">
              Modelos
            </a>
            <a href="#como-funciona" className="transition hover:text-white">
              Como funciona
            </a>
            <a href="#unidades" className="transition hover:text-white">
              Unidades
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white/60 transition hover:text-white sm:flex"
            >
              <IconLock className="h-3.5 w-3.5" /> Área administrativa
            </Link>
            <button
              type="button"
              onClick={() => irParaProposta()}
              className="rounded-lg bg-brand px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-brand-soft"
            >
              Solicitar proposta
            </button>
          </div>
        </div>
      </header>

      {/* ===== hero ===== */}
      <section className="listras relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-brand/25 blur-[140px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-brand/10 blur-[120px]" />

        <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 pb-24 pt-10 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-soft">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
              Condições exclusivas de fábrica
            </p>
            <h1 className="titulo mt-4 text-6xl leading-[0.9] sm:text-7xl lg:text-8xl">
              Sua próxima
              <br />
              <span className="text-brand">Honda</span> zero km
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/65">
              Entrada facilitada e parcelas que cabem no seu bolso. Deixe seus dados e um consultor oficial chama
              você no WhatsApp com a simulação pronta.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => irParaProposta()}
                className="flex items-center gap-2 rounded-lg bg-brand px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-glow transition hover:bg-brand-soft"
              >
                Quero minha proposta <IconArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#modelos"
                className="rounded-lg border border-white/20 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:border-white/50"
              >
                Ver modelos
              </a>
            </div>
          </div>

          <div className="relative">
            <span
              aria-hidden="true"
              className="titulo texto-contorno pointer-events-none absolute -top-6 right-0 select-none text-[8rem] leading-none sm:text-[12rem]"
            >
              0 km
            </span>
            <MotoFoto
              slug="hero"
              alt="Moto Honda zero quilômetro"
              cor="#E10A2B"
              className="relative w-full max-w-xl drop-shadow-[0_24px_40px_rgba(225,10,43,0.35)] lg:ml-auto"
            />
            <div className="absolute -bottom-2 left-0 flex items-center gap-2 rounded-xl border border-white/10 bg-panel/90 px-3 py-2 backdrop-blur sm:left-4">
              <IconShieldCheck className="h-6 w-6 text-brand" />
              <div className="leading-tight">
                <p className="titulo text-xl">3 anos</p>
                <p className="text-[10px] text-white/55">de garantia Honda</p>
              </div>
            </div>
            <span className="absolute right-0 top-14 -skew-x-6 rounded bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white sm:right-4">
              Pronta entrega
            </span>
          </div>
        </div>
      </section>

      {/* ===== barra de proposta ===== */}
      <section
        ref={propostaRef}
        id="proposta"
        className="relative z-10 mx-auto -mt-16 max-w-6xl scroll-mt-24 px-4 lg:-mt-20"
      >
        <div className="overflow-hidden rounded-2xl border border-white/10 border-t-brand bg-panel p-5 shadow-card sm:p-6 [border-top-width:3px]">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand-soft">
                Atendimento digital • resposta em cerca de 5 min
              </p>
              <h2 className="titulo text-3xl">Solicitar proposta</h2>
            </div>
            {linkPlantao && (
              <a
                href={linkPlantao}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                <IconMessage className="h-4 w-4" /> Prefere falar agora? Chamar no WhatsApp
              </a>
            )}
          </div>
          <ProposalForm modeloInicial={modeloEscolhido} />
        </div>
      </section>

      {/* ===== números ===== */}
      <section className="mx-auto mt-14 max-w-6xl px-4">
        <div className="grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-panel/60">
          {NUMEROS.map((n) => (
            <div key={n.valor} className="px-3 py-4 sm:px-6 sm:py-5">
              <p className="titulo text-3xl text-brand sm:text-5xl">{n.valor}</p>
              <p className="mt-1 text-[10px] leading-snug text-white/55 sm:text-xs">{n.legenda}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== modelos ===== */}
      <section id="modelos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-soft">Garagem Sol Nascente</p>
            <h2 className="titulo text-4xl sm:text-5xl">A linha Honda completa</h2>
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar modelos por categoria">
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={categoria === c}
                onClick={() => setCategoria(c)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                  categoria === c
                    ? "bg-brand text-white"
                    : "border border-white/15 text-white/65 hover:border-white/40 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* celular: carrossel deslizável; a partir de sm: grade */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {motosVisiveis.map((moto, i) => (
            <article
              key={moto.slug}
              className="group relative flex min-w-[78%] snap-center flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel p-4 transition hover:-translate-y-1 hover:border-brand/60 hover:shadow-glow sm:min-w-0"
            >
              <span
                aria-hidden="true"
                className="titulo texto-contorno pointer-events-none absolute right-3 top-1 text-7xl leading-none"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                <span className="rounded bg-white/10 px-2 py-0.5 text-white/80">{moto.categoria}</span>
                <span className="text-brand-soft">{moto.situacao}</span>
              </div>
              <div className="relative my-3 grid h-36 place-items-center rounded-xl bg-gradient-to-b from-white/[0.04] to-transparent">
                <MotoFoto
                  slug={moto.slug}
                  alt={moto.nome}
                  cor={moto.cor}
                  className="h-full w-full px-2 transition duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="titulo text-2xl leading-none">{moto.nome.replace("Honda ", "")}</h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-white/55">{moto.descricao}</p>
              <div className="mt-3 min-h-[44px]">
                {moto.parcela ? (
                  <>
                    <p className="text-[11px] text-white/50">Parcelas a partir de</p>
                    <p className="titulo text-3xl text-brand">
                      {formatarReais(moto.parcela)}
                      <span className="text-sm font-semibold not-italic text-white/50">/mês</span>
                    </p>
                  </>
                ) : (
                  <p className="pt-3 text-sm font-semibold text-white/70">Consulte as condições</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => irParaProposta(moto.nome)}
                className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-white/15 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition group-hover:border-brand group-hover:bg-brand"
              >
                Simular esta moto <IconArrowRight className="h-3.5 w-3.5" />
              </button>
            </article>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-white/35">
          Valores ilustrativos, sujeitos a análise de crédito e disponibilidade de estoque.
        </p>
      </section>

      {/* ===== como funciona ===== */}
      <section id="como-funciona" className="listras scroll-mt-16 border-y border-white/10 bg-panel/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-soft">Do clique ao test-ride</p>
          <h2 className="titulo text-4xl sm:text-5xl">Como funciona</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {ETAPAS.map((etapa, i) => (
              <li key={etapa.titulo} className="relative rounded-2xl border border-white/10 bg-night/70 p-6">
                <span className="titulo texto-contorno text-7xl leading-none">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="titulo mt-2 text-2xl">{etapa.titulo}</h3>
                <p className="mt-1 text-sm text-white/60">{etapa.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== unidades ===== */}
      <section id="unidades" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16">
        <p className="text-[11px] font-bold uppercase tracking-widest text-brand-soft">Rede Sol Nascente</p>
        <h2 className="titulo text-4xl sm:text-5xl">Nossas concessionárias</h2>
        <p className="mt-2 max-w-xl text-sm text-white/55">
          Estrutura completa com oficina autorizada, boutique de peças originais e test-ride disponível.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {Object.values(UNIDADES).map((u) => {
            const cidade = u.rotulo.split(" - ")[0];
            const link = linkWhatsappUnidade(u, `Olá! Gostaria de falar com a unidade ${u.rotulo}.`);
            const classeBotao =
              "flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand";
            return (
              <article key={u.id} className="relative overflow-hidden rounded-2xl border border-white/10 bg-panel p-6">
                <span
                  aria-hidden="true"
                  className="titulo texto-contorno pointer-events-none absolute -right-2 -top-3 text-8xl leading-none"
                >
                  {cidade}
                </span>
                <span className="relative rounded bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                  {u.tipo}
                </span>
                <h3 className="titulo relative mt-3 text-3xl">{u.nome}</h3>
                <p className="relative mt-4 flex items-start gap-2 text-sm text-white/70">
                  <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {u.endereco}
                </p>
                <p className="relative mt-2 flex items-start gap-2 text-sm text-white/70">
                  <IconClock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> {u.horario}
                </p>
                <div className="relative mt-5">
                  {link ? (
                    <a href={link} target="_blank" rel="noreferrer" className={classeBotao}>
                      <IconMessage className="h-4 w-4" /> Falar com {cidade}
                    </a>
                  ) : (
                    <button type="button" onClick={() => irParaProposta()} className={classeBotao}>
                      <IconMessage className="h-4 w-4" /> Falar com {cidade}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-xs text-white/45 sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} Sol Nascente Motos Honda. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* ===== botão flutuante de WhatsApp ===== */}
      {linkPlantao ? (
        <a
          href={linkPlantao}
          target="_blank"
          rel="noreferrer"
          aria-label="Falar no WhatsApp"
          className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-white shadow-lg transition hover:scale-105 hover:bg-emerald-400"
        >
          <IconMessage className="h-7 w-7" />
        </a>
      ) : (
        <button
          type="button"
          onClick={() => irParaProposta()}
          aria-label="Solicitar proposta"
          className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-glow transition hover:scale-105 hover:bg-brand-soft"
        >
          <IconMessage className="h-7 w-7" />
        </button>
      )}
    </div>
  );
}
