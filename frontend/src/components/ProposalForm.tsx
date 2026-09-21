import { FormEvent, useEffect, useState } from "react";
import { postComRetentativa } from "../api/client";
import { MODELOS_FORMULARIO, UNIDADES } from "../config";
import { mascararTelefone, soDigitos } from "../lib/format";
import type { NovoLeadRequest, Unidade } from "../types";
import { IconArrowRight, IconCheck, IconLock, IconSmartphone, IconUser } from "./Icons";

interface ProposalFormProps {
  // modelo pré-selecionado quando a pessoa clica em "Simular esta moto"
  modeloInicial?: string;
}

type Erros = Partial<Record<"nome" | "whatsapp" | "modelo", string>>;

export default function ProposalForm({ modeloInicial = "" }: ProposalFormProps) {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [modelo, setModelo] = useState(modeloInicial);
  const [unidade, setUnidade] = useState<Unidade>("TERESINA");

  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    if (modeloInicial) setModelo(modeloInicial);
  }, [modeloInicial]);

  function validar(): Erros {
    const e: Erros = {};
    if (nome.trim().length < 3) e.nome = "Informe seu nome completo.";
    const digitos = soDigitos(whatsapp);
    if (digitos.length < 10 || digitos.length > 11) e.whatsapp = "Informe um WhatsApp válido, com DDD.";
    if (!modelo) e.modelo = "Escolha o modelo do seu interesse.";
    return e;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    setErroGeral(null);
    setAviso(null);

    const encontrados = validar();
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setEnviando(true);
    try {
      const payload: NovoLeadRequest = {
        nome: nome.trim(),
        whatsapp: whatsapp.trim(),
        modeloInteresse: modelo,
        unidade,
      };
      await postComRetentativa("/leads", payload, (tentativa, total) =>
        setAviso(`Nosso servidor está acordando, tentando novamente (${tentativa}/${total})…`)
      );
      setEnviado(true);
      setNome("");
      setWhatsapp("");
      setModelo("");
      setUnidade("TERESINA");
    } catch (err: any) {
      setErroGeral(
        err.response?.data?.erro ??
          "Não foi possível enviar agora. Confira sua conexão e tente novamente em instantes."
      );
    } finally {
      setEnviando(false);
      setAviso(null);
    }
  }

  if (enviado) {
    return (
      <div className="flex flex-col items-center gap-3 px-2 py-8 text-center" role="status">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-600">
          <IconCheck className="h-7 w-7" />
        </span>
        <h3 className="text-lg font-bold">Recebemos sua solicitação!</h3>
        <p className="text-sm text-slate-500">
          Um consultor da Sol Nascente vai falar com você pelo WhatsApp em poucos minutos.
        </p>
        <button
          type="button"
          onClick={() => setEnviado(false)}
          className="mt-2 text-sm font-semibold text-brand underline-offset-2 hover:underline"
        >
          Solicitar outra proposta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="pf-nome" className="mb-1 block text-xs font-semibold text-slate-700">
          Nome completo
        </label>
        <div className="relative">
          <IconUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="pf-nome"
            className={`campo pl-9 ${erros.nome ? "campo-erro" : ""}`}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome completo"
            autoComplete="name"
            aria-invalid={!!erros.nome}
          />
        </div>
        {erros.nome && <p className="mt-1 text-xs text-red-600">{erros.nome}</p>}
      </div>

      <div>
        <label htmlFor="pf-whatsapp" className="mb-1 block text-xs font-semibold text-slate-700">
          WhatsApp
        </label>
        <div className="relative">
          <IconSmartphone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="pf-whatsapp"
            className={`campo pl-9 ${erros.whatsapp ? "campo-erro" : ""}`}
            value={whatsapp}
            onChange={(e) => setWhatsapp(mascararTelefone(e.target.value))}
            placeholder="(86) 99999-9999"
            inputMode="tel"
            autoComplete="tel-national"
            aria-invalid={!!erros.whatsapp}
          />
        </div>
        {erros.whatsapp && <p className="mt-1 text-xs text-red-600">{erros.whatsapp}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <label htmlFor="pf-modelo" className="mb-1 block text-xs font-semibold text-slate-700">
            Modelo de interesse
          </label>
          <select
            id="pf-modelo"
            className={`campo ${erros.modelo ? "campo-erro" : ""} ${modelo ? "" : "text-slate-400"}`}
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            aria-invalid={!!erros.modelo}
          >
            <option value="">Selecione o modelo</option>
            {MODELOS_FORMULARIO.map((m) => (
              <option key={m} value={m} className="text-ink">
                {m}
              </option>
            ))}
          </select>
          {erros.modelo && <p className="mt-1 text-xs text-red-600">{erros.modelo}</p>}
        </div>

        <div>
          <label htmlFor="pf-unidade" className="mb-1 block text-xs font-semibold text-slate-700">
            Unidade
          </label>
          <select
            id="pf-unidade"
            className="campo"
            value={unidade}
            onChange={(e) => setUnidade(e.target.value as Unidade)}
          >
            {Object.values(UNIDADES).map((u) => (
              <option key={u.id} value={u.id}>
                {u.rotulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {aviso && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800" role="status">
          {aviso}
        </p>
      )}
      {erroGeral && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {erroGeral}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
      >
        {enviando ? (
          "Enviando..."
        ) : (
          <>
            Quero receber atendimento <IconArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <IconLock className="h-3 w-3" /> Seus dados estão protegidos pela LGPD
      </p>
    </form>
  );
}
