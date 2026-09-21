import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { IconLock, IconUser } from "../components/Icons";
import Logo from "../components/Logo";
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
      setErro(err.response?.data?.erro ?? "Não foi possível entrar. Verifique suas credenciais e tente de novo.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-900 via-slate-800 to-brand-dark px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo clara />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border-t-4 border-brand bg-white p-7 shadow-2xl">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand">Área restrita</p>
            <h1 className="text-xl font-extrabold">Painel administrativo</h1>
          </div>

          <div>
            <label htmlFor="login-email" className="mb-1 block text-xs font-semibold text-slate-700">
              E-mail
            </label>
            <div className="relative">
              <IconUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="login-email"
                type="email"
                className="campo pl-9"
                placeholder="voce@empresa.com"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-senha" className="mb-1 block text-xs font-semibold text-slate-700">
              Senha
            </label>
            <div className="relative">
              <IconLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="login-senha"
                type="password"
                className="campo pl-9"
                placeholder="Sua senha"
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
          </div>

          {erro && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-brand py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
          >
            {carregando ? "Aguarde..." : "Entrar"}
          </button>

          <p className="text-center text-xs text-slate-500">
            <Link to="/" className="font-semibold text-brand hover:underline">
              ← Voltar ao site
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
