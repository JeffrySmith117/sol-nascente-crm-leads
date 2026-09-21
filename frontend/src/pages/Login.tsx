import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { IconLock, IconUser } from "../components/Icons";
import Logo from "../components/Logo";
import { MarcaDagua, Mascote } from "../components/Marca";
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
    <div className="tema-claro relative min-h-screen overflow-hidden bg-white">
      <MarcaDagua />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1.5 bg-brand" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-5xl items-center gap-8 px-4 py-10 lg:grid-cols-2">
        {/* mascote (só aparece quando /public/marca/mascote.* existir) */}
        <div className="hidden justify-center lg:flex">
          <Mascote className="max-h-[520px] w-auto object-contain drop-shadow-2xl" />
        </div>

        <div className="mx-auto w-full max-w-sm">
          {/* celular: mascote menor acima do formulário */}
          <div className="mb-3 flex justify-center lg:hidden">
            <Mascote className="max-h-32 w-auto object-contain" />
          </div>
          <div className="mb-6 flex justify-center lg:justify-start">
            <Logo tema="claro" imagem />
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-7 shadow-xl backdrop-blur [border-top-color:#E10A2B] [border-top-width:4px]"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand">Área restrita</p>
              <h1 className="titulo text-4xl text-slate-900">Painel de atendimento</h1>
              <p className="text-sm text-slate-500">Entre para acompanhar os leads da concessionária.</p>
            </div>

            <div>
              <label
                htmlFor="login-email"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500"
              >
                E-mail
              </label>
              <div className="relative">
                <IconUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-email"
                  type="email"
                  className="campo-claro pl-9"
                  placeholder="voce@empresa.com"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-senha"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500"
              >
                Senha
              </label>
              <div className="relative">
                <IconLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-senha"
                  type="password"
                  className="campo-claro pl-9"
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
              className="w-full rounded-lg bg-brand py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
            >
              {carregando ? "Aguarde..." : "Entrar"}
            </button>

            <p className="text-center text-xs">
              <Link to="/" className="font-semibold text-slate-500 hover:text-brand">
                ← Voltar ao site
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
