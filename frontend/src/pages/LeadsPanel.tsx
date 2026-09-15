import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { Lead, StatusLead } from "../types";

const STATUS_LABEL: Record<StatusLead, string> = {
  NOVO: "Novo",
  EM_CONTATO: "Em contato",
  CONVERTIDO: "Convertido",
  PERDIDO: "Perdido",
};

const STATUS_COLOR: Record<StatusLead, string> = {
  NOVO: "bg-blue-100 text-blue-700",
  EM_CONTATO: "bg-amber-100 text-amber-700",
  CONVERTIDO: "bg-green-100 text-green-700",
  PERDIDO: "bg-gray-200 text-gray-600",
};

export default function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filtro, setFiltro] = useState<StatusLead | "TODOS">("TODOS");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    setCarregando(true);
    setErro(null);
    api
      .get<Lead[]>("/leads")
      .then((r) => setLeads(r.data))
      .catch(() => setErro("Não foi possível carregar os leads."))
      .finally(() => setCarregando(false));
  }

  async function mudarStatus(id: number, status: StatusLead) {
    setLeads((atual) => atual.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await api.patch(`/leads/${id}/status`, { status });
    } catch {
      carregar();
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    localStorage.removeItem("perfil");
    navigate("/login");
  }

  const leadsFiltrados = leads
    .filter((l) => filtro === "TODOS" || l.status === filtro)
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand">Leads - Solnascente Motos</h1>
          <p className="text-sm text-gray-500">{localStorage.getItem("nome")}</p>
        </div>
        <button onClick={logout} className="text-sm text-gray-500 underline">
          Sair
        </button>
      </header>

      <div className="flex gap-2 flex-wrap">
        {(["TODOS", "NOVO", "EM_CONTATO", "CONVERTIDO", "PERDIDO"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFiltro(s)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
              filtro === s ? "bg-brand text-white border-brand" : "text-gray-600 border-gray-300"
            }`}
          >
            {s === "TODOS" ? "Todos" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {carregando && <p className="text-sm text-gray-500">Carregando...</p>}
      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <div className="space-y-3">
        {!carregando && leadsFiltrados.length === 0 && (
          <p className="text-sm text-gray-500">Nenhum lead por aqui.</p>
        )}

        {leadsFiltrados.map((lead) => (
          <div key={lead.id} className="bg-white rounded-xl shadow-sm p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{lead.nome}</p>
                <a href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-brand underline"
                >
                  {lead.whatsapp}
                </a>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[lead.status]}`}>
                {STATUS_LABEL[lead.status]}
              </span>
            </div>

            <p className="text-sm text-gray-600">
              Interesse: <strong>{lead.modeloInteresse}</strong> - {lead.unidade === "TERESINA" ? "Teresina" : "Timon"}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(lead.criadoEm).toLocaleString("pt-BR")}
            </p>

            <select
              className="w-full border rounded-md px-2 py-1.5 text-sm mt-1"
              value={lead.status}
              onChange={(e) => mudarStatus(lead.id, e.target.value as StatusLead)}
            >
              {(Object.keys(STATUS_LABEL) as StatusLead[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}