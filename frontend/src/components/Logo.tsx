import { ImagemMarca } from "./Marca";

interface LogoProps {
  // "claro" = versão para fundo branco (texto escuro)
  tema?: "escuro" | "claro";
  // usa a logo oficial de /public/marca/logo.* quando existir (telas administrativas)
  imagem?: boolean;
}

function LogoTexto({ tema }: { tema: "escuro" | "claro" }) {
  const claro = tema === "claro";
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="grid h-10 w-10 shrink-0 -skew-x-6 place-items-center rounded-md bg-brand font-display text-xl font-extrabold italic text-white shadow-glow"
        aria-hidden="true"
      >
        SN
      </span>
      <span className="leading-none">
        <span className={`titulo block text-xl ${claro ? "text-slate-900" : "text-white"}`}>Sol Nascente</span>
        <span
          className={`mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.18em] ${
            claro ? "text-slate-500" : "text-white/55"
          }`}
        >
          Concessionária autorizada • Honda
        </span>
      </span>
    </span>
  );
}

export default function Logo({ tema = "escuro", imagem = false }: LogoProps) {
  if (!imagem) return <LogoTexto tema={tema} />;

  return (
    <ImagemMarca
      caminho="/marca/logo"
      alt="Sol Nascente Motos"
      className="h-11 w-auto"
      fallback={<LogoTexto tema={tema} />}
    />
  );
}
