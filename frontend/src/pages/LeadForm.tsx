import { FormEvent, useState } from "react";
import { api } from "../api/client";
import type { NovoLeadRequest, Unidade } from "../types";

export default function LeadForm() {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [modeloInteresse, setModeloInteresse] = useState("");
  const [unidade, setUnidade] = useState<Unidade>("TERESINA");

  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "erro" | "sucesso"; texto: string } | null>(null);

  function validar(): string | null {
    if (nome.trim().length < 3) return "Informe seu nome completo.";
    const digitos = whatsapp.replace(/\D/g, "");
    if (digitos.length < 10 || digitos.length > 11) return "Informe um WhatsApp válido, com DDD.";
    if (modeloInteresse.trim().length < 2) return "Informe o modelo de moto do seu interesse.";
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMensagem(null);

    const erroValidacao = validar();
    if (erroValidacao) {
      setMensagem({ tipo: "erro", texto: erroValidacao });
      return;
    }

    setEnviando(true);
    try {
      const payload: NovoLeadRequest = {
        nome: nome.trim(),
        whatsapp: whatsapp.trim(),
        modeloInteresse: modeloInteresse.trim(),
        unidade,
      };
      await api.post("/leads", payload);
      setMensagem({
        tipo: "sucesso",
        texto: "Recebemos seu contato! Nossa equipe vai falar com você em breve pelo WhatsApp.",
      });
      setNome("");
      setWhatsapp("");
      setModeloInteresse("");
      setUnidade("TERESINA");
    } catch (err: any) {
      setMensagem({ tipo: "erro", texto: err.response?.data?.erro ?? "Não foi possível enviar. Tente novamente." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md rounded-xl p-8 space-y-4"
      >
        <header className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-brand">Solnascente Motos Honda</h1>
          <p className="text-gray-500 text-sm">
            Deixe seus dados que nossa equipe entra em contato pelo WhatsApp
          </p>
        </header>

        <div>
          <label className="text-sm font-medium">Nome completo</label>
          <input
            className="w-full border rounded-md px-3 py-2 mt-1"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">WhatsApp</label>
          <input
            className="w-full border rounded-md px-3 py-2 mt-1"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="(86) 99999-9999"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Modelo de interesse</label>
          <input
            className="w-full border rounded-md px-3 py-2 mt-1"
            value={modeloInteresse}
            onChange={(e) => setModeloInteresse(e.target.value)}
            placeholder="Ex: CG 160, Biz, PCX, XRE 300..."
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Unidade de preferência</label>
          <select
            className="w-full border rounded-md px-3 py-2 mt-1"
            value={unidade}
            onChange={(e) => setUnidade(e.target.value as Unidade)}
          >
            <option value="TERESINA">Teresina</option>
            <option value="TIMON">Timon</option>
          </select>
        </div>

        {mensagem && (
          <p className={mensagem.tipo === "erro" ? "text-red-600 text-sm" : "text-green-600 text-sm"}>
            {mensagem.texto}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-brand hover:bg-brand-dark text-white rounded-md py-2.5 font-semibold disabled:opacity-60"
        >
          {enviando ? "Enviando..." : "Quero ser contatado"}
        </button>

        <p className="text-center text-xs text-gray-400">
          <a href="/login" className="underline">Área administrativa</a>
        </p>
      </form>
    </div>
  );
}