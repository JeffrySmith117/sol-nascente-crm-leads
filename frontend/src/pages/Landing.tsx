import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { aquecerApi } from "../api/client";
import {
  IconAward,
  IconChevronDown,
  IconClock,
  IconExternal,
  IconLock,
  IconMapPin,
  IconMessage,
  IconPercent,
  IconShieldCheck,
  IconZap,
} from "../components/Icons";
import Logo from "../components/Logo";
import MotoArt from "../components/MotoArt";
import ProposalForm from "../components/ProposalForm";
import { linkWhatsappUnidade, MOTOS_DESTAQUE, UNIDADES } from "../config";
import { formatarReais } from "../lib/format";

export default function Landing() {
  const [modeloEscolhido, setModeloEscolhido] = useState("");
  const propostaRef = useRef<HTMLDivElement>(null);

  // começa a acordar o backend (plano gratuito do Render) enquanto a pessoa lê a página
  useEffect(() => {
    aquecerApi();
  }, []);

  function irParaProposta(modelo?: string) {
    if (modelo) setModeloEscolhido(modelo);
    propostaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const teresina = UNIDADES.TERESINA;
  const linkAtendimentoImediato = linkWhatsappUnidade(teresina, "Olá! Gostaria de atendimento sobre motos Honda.");

  return (
    <div className="min-h-screen">
      {/* ===== navbar ===== */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-8">
            <Link to="/" aria-label="Sol Nascente Motos Honda">
              <Logo />
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
              <a href="#modelos" className="flex items-center gap-1 hover:text-brand">
                Modelos <IconChevronDown className="h-3.5 w-3.5" />
              </a>
              <a href="#unidades" className="hover:text-brand">
                Unidades
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#unidades"
              className="hidden items-center gap-1.5 rounded-lg bg-chip px-3 py-2 text-xs font-semibold text-slate-700 sm:flex"
            >
              <IconMessage className="h-4 w-4 text-brand" /> Teresina &amp; Timon
            </a>
            <Link
              to="/login"
              className="flex items-center gap-1.5 rounded-lg bg-chip px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              <IconLock className="h-4 w-4" /> Área Administrativa
            </Link>
          </div>
        </div>
      </header>

      {/* ===== hero ===== */}
      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-10 pt-8 lg:grid-cols-[1.25fr_1fr] lg:items-start">
        <div>
          <p className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl bg-white px-3 py-1.5 text-[11px] text-slate-500 shadow-card">
            <span className="rounded-full bg-brand-soft px-2 py-0.5 font-bold uppercase tracking-wide text-brand">
              Condições exclusivas de fábrica
            </span>
            Entrada facilitada + parcelas que cabem no seu bolso
          </p>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Encontre sua <span className="text-brand">próxima Honda</span> zero km.
          </h1>
          <p className="mt-3 max-w-xl text-slate-600">
            Preencha seus dados e nossa equipe de consultores oficiais entrará em contato pelo WhatsApp para ajudar
            você a encontrar a moto ideal com simulação em tempo real.
          </p>

          <div className="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-brand-dark shadow-card">
            <div className="grid place-items-center px-6 pb-4 pt-10">
              <MotoArt cor="#E11D2E" className="w-full max-w-md drop-shadow-2xl" />
            </div>
            <div className="flex flex-wrap items-end justify-between gap-3 bg-black/40 p-5">
              <div>
                <div className="mb-2 flex gap-2">
                  <span className="rounded bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-800">
                    Showroom oficial
                  </span>
                  <span className="rounded bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Pronta entrega
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white sm:text-2xl">Linha Honda Performance &amp; Urbano</h2>
                <p className="text-xs text-white/75">
                  Disponível para test-ride nas concessionárias de Teresina e Timon
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2">
                <IconShieldCheck className="h-6 w-6 text-brand" />
                <div className="leading-tight">
                  <p className="text-lg font-extrabold">3 Anos</p>
                  <p className="text-[10px] text-slate-500">de Garantia Honda</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { icone: <IconClock className="h-5 w-5 text-brand" />, valor: "5 min", legenda: "Tempo médio de primeiro contato" },
              { icone: <IconPercent className="h-5 w-5 text-brand" />, valor: "0% Taxa", legenda: "Planos de consórcio contemplados" },
              { icone: <IconAward className="h-5 w-5 text-brand" />, valor: "Líder", legenda: "Maior estoque do Piauí e Maranhão" },
            ].map((item) => (
              <div key={item.valor} className="rounded-xl bg-white p-3 shadow-card">
                <div className="flex items-center gap-2">
                  {item.icone}
                  <p className="text-sm font-extrabold sm:text-base">{item.valor}</p>
                </div>
                <p className="mt-1 text-[11px] leading-snug text-slate-500">{item.legenda}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== card do formulário ===== */}
        <aside ref={propostaRef} id="proposta" className="scroll-mt-24 space-y-4 lg:sticky lg:top-20">
          <div className="overflow-hidden rounded-2xl border-t-4 border-brand bg-white p-6 shadow-card">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand">Atendimento digital</p>
                <h2 className="text-xl font-extrabold">Solicitar Proposta</h2>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand">
                <IconZap className="h-5 w-5" />
              </span>
            </div>
            <ProposalForm modeloInicial={modeloEscolhido} />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-card">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-green-50 text-green-600">
                <IconMessage className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold">Prefere atendimento imediato?</p>
                <p className="text-xs text-slate-500">Fale com o plantão de vendas online</p>
              </div>
            </div>
            {linkAtendimentoImediato ? (
              <a
                href={linkAtendimentoImediato}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-green-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-800"
              >
                Chamar <IconExternal className="h-4 w-4" />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => irParaProposta()}
                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-800"
              >
                Chamar
              </button>
            )}
          </div>
        </aside>
      </section>

      {/* ===== mais procuradas ===== */}
      <section id="modelos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand">Garagem Sol Nascente</p>
            <h2 className="text-2xl font-extrabold">Mais Procuradas da Semana</h2>
          </div>
          <button
            type="button"
            onClick={() => irParaProposta()}
            className="hidden text-sm font-semibold text-brand hover:underline sm:block"
          >
            Ver todas as condições →
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOTOS_DESTAQUE.map((moto) => (
            <article key={moto.nome} className="flex flex-col rounded-2xl bg-white p-3 shadow-card">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-100 to-slate-200">
                <div className="flex items-center justify-between p-2 text-[10px] font-bold">
                  <span className="rounded bg-ink px-2 py-0.5 text-white">{moto.selo}</span>
                  <span className="text-green-700">{moto.situacao}</span>
                </div>
                <MotoArt cor={moto.cor} className="mx-auto -mt-1 h-32 w-full px-3 pb-2" />
              </div>
              <h3 className="mt-3 font-bold">{moto.nome}</h3>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-500">{moto.descricao}</p>
              <p className="mt-3 text-[11px] text-slate-500">Parcelas a partir de</p>
              <p className="text-xl font-extrabold text-brand">
                {formatarReais(moto.parcela)}
                <span className="text-xs font-semibold text-slate-500">/mês</span>
              </p>
              <button
                type="button"
                onClick={() => irParaProposta(moto.nome)}
                className="mt-3 rounded-lg bg-chip py-2 text-xs font-bold text-slate-700 transition hover:bg-brand hover:text-white"
              >
                Simular esta moto
              </button>
            </article>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-slate-400">
          Valores ilustrativos, sujeitos a análise de crédito e disponibilidade de estoque.
        </p>
      </section>

      {/* ===== unidades ===== */}
      <section id="unidades" className="scroll-mt-16 bg-chip/70 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand">Rede Sol Nascente</p>
            <h2 className="text-2xl font-extrabold">Nossas Concessionárias</h2>
            <p className="mx-auto mt-1 max-w-xl text-sm text-slate-500">
              Estrutura completa com oficina autorizada, boutique de peças originais e test-ride disponível.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {Object.values(UNIDADES).map((u) => {
              const link = linkWhatsappUnidade(u, `Olá! Gostaria de falar com a unidade ${u.rotulo}.`);
              const classeBotao =
                "block w-full rounded-lg bg-chip py-2.5 text-center text-sm font-bold text-slate-700 transition hover:bg-brand hover:text-white";
              return (
                <article key={u.id} className="rounded-2xl bg-white p-5 shadow-card">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold">{u.nome}</h3>
                    <span className="rounded bg-chip px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                      {u.tipo}
                    </span>
                  </div>
                  <p className="mt-3 flex items-start gap-2 text-sm text-slate-600">
                    <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {u.endereco}
                  </p>
                  <p className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                    <IconClock className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> {u.horario}
                  </p>
                  <div className="mt-4">
                    {link ? (
                      <a href={link} target="_blank" rel="noreferrer" className={classeBotao}>
                        Falar com {u.rotulo.split(" - ")[0]}
                      </a>
                    ) : (
                      <button type="button" onClick={() => irParaProposta()} className={classeBotao}>
                        Falar com {u.rotulo.split(" - ")[0]}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-slate-500 sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} Sol Nascente Motos Honda. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
