import axios, { AxiosError } from "axios";

// em produção (Vercel), VITE_API_URL aponta para o backend no Render;
// em desenvolvimento local, cai no localhost por padrão
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// injeta o token JWT salvo no login em toda requisição autenticada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// se o token expirar/for inválido, desloga e manda pra tela de login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// o plano gratuito do Render "dorme" o backend após alguns minutos parado. Enquanto ele acorda, o
// proxy responde 502/503/504 (sem cabeçalhos de CORS, o que o navegador enxerga como erro de rede)
// ou simplesmente demora além do timeout. Nesses casos vale tentar de novo em vez de falhar.
const ESPERAS_MS = [2000, 5000, 10000];

function deveTentarDeNovo(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return false;
  const status = (err as AxiosError).response?.status;
  if (status === undefined) return true; // sem resposta: rede caiu, timeout ou servidor acordando
  return status === 502 || status === 503 || status === 504;
}

const dormir = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function postComRetentativa<T>(
  url: string,
  dados: unknown,
  aoTentarNovamente?: (tentativa: number, total: number) => void
): Promise<T> {
  const total = ESPERAS_MS.length + 1;
  for (let tentativa = 1; ; tentativa++) {
    try {
      const { data } = await api.post<T>(url, dados);
      return data;
    } catch (err) {
      if (tentativa >= total || !deveTentarDeNovo(err)) throw err;
      aoTentarNovamente?.(tentativa + 1, total);
      await dormir(ESPERAS_MS[tentativa - 1]);
    }
  }
}

// dispara uma requisição "descartável" assim que o visitante abre a landing, para o backend do
// Render começar a acordar enquanto a pessoa ainda preenche o formulário. "no-cors" evita ruído de
// CORS no console: a resposta não interessa, só o efeito de acordar o servidor.
export function aquecerApi(): void {
  fetch(`${API_URL}/leads`, { method: "GET", mode: "no-cors" }).catch(() => undefined);
}
