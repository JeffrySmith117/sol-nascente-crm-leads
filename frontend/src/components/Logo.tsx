interface LogoProps {
  // versão sobre fundo escuro/vermelho (texto claro)
  clara?: boolean;
  // esconde o texto e mostra só o selo
  apenasSelo?: boolean;
}

export default function Logo({ clara = false, apenasSelo = false }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-sm font-extrabold tracking-tight shadow-sm ${
          clara ? "bg-white text-brand" : "bg-brand text-white"
        }`}
        aria-hidden="true"
      >
        SN
      </span>
      {!apenasSelo && (
        <span className="leading-tight">
          <span className={`block text-sm font-extrabold uppercase ${clara ? "text-white" : "text-ink"}`}>
            Sol Nascente
          </span>
          <span
            className={`block text-[9px] font-semibold uppercase tracking-wider ${
              clara ? "text-white/80" : "text-brand"
            }`}
          >
            Concessionária autorizada • Honda
          </span>
        </span>
      )}
    </span>
  );
}
