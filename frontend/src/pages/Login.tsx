import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { TokenResponse } from "../types";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const { data } = await api.post<TokenResponse>("/auth/login", { email, senha });

      localStorage.setItem("token", data.token);
      localStorage.setItem("nome", data.nome);
      localStorage.setItem("perfil", data.perfil);

      navigate("/admin");
    } catch (err: any) {
      setErro(err.response?.data?.erro ?? "Não foi possível entrar. Verifique suas credenciais.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white shadow-md rounded-xl p-8 space-y-4"
      >
        <h1 className="text-2xl font-bold text-brand">Área administrativa</h1>

        <input
          type="email"
          className="w-full border rounded-md px-3 py-2"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border rounded-md px-3 py-2"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        {erro && <p className="text-red-600 text-sm">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-brand hover:bg-brand-dark text-white rounded-md py-2 font-semibold disabled:opacity-60"
        >
          {carregando ? "Aguarde..." : "Entrar"}
        </button>

        <p className="text-center text-xs text-gray-400">
          <a href="/" className="underline">Voltar ao formulário de contato</a>
        </p>
      </form>
    </div>
  );
}