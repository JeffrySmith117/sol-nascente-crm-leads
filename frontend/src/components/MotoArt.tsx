interface MotoArtProps {
  cor?: string; // cor do tanque e das carenagens
  className?: string;
}

// ilustração vetorial genérica de uma moto (vista lateral). Serve de imagem enquanto a loja não
// sobe as fotos reais dos modelos: basta trocar o <MotoArt /> por um <img /> nos componentes.
export default function MotoArt({ cor = "#C8102E", className }: MotoArtProps) {
  return (
    <svg
      viewBox="0 0 420 240"
      className={className}
      role="img"
      aria-label="Ilustração de motocicleta"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="moto-glow" x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <ellipse cx="212" cy="222" rx="170" ry="9" fill={cor} opacity="0.5" filter="url(#moto-glow)" />

      {/* rodas */}
      {[100, 322].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="172" r="46" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <circle cx={cx} cy="172" r="31" fill="#E5E7EB" />
          <circle cx={cx} cy="172" r="24" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
          <g stroke="#94A3B8" strokeWidth="2">
            <line x1={cx} y1="150" x2={cx} y2="194" />
            <line x1={cx - 22} y1="172" x2={cx + 22} y2="172" />
            <line x1={cx - 15.5} y1="156.5" x2={cx + 15.5} y2="187.5" />
            <line x1={cx - 15.5} y1="187.5" x2={cx + 15.5} y2="156.5" />
          </g>
          <circle cx={cx} cy="172" r="7" fill="#475569" />
        </g>
      ))}

      {/* balança traseira e escape */}
      <path d="M100 172 L196 156" stroke="#334155" strokeWidth="9" strokeLinecap="round" />
      <path d="M176 176 L84 190" stroke="#94A3B8" strokeWidth="11" strokeLinecap="round" />
      <path d="M96 190 L74 193" stroke="#475569" strokeWidth="13" strokeLinecap="round" />

      {/* motor */}
      <rect x="172" y="120" width="82" height="48" rx="8" fill="#334155" />
      <rect x="186" y="106" width="52" height="20" rx="4" fill="#475569" />
      <circle cx="226" cy="146" r="12" fill="#64748B" />

      {/* garfo e amortecedor */}
      <path d="M296 88 L322 172" stroke="#CBD5E1" strokeWidth="9" strokeLinecap="round" />
      <path d="M290 84 L316 168" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />

      {/* banco */}
      <path d="M62 112 C86 100 138 100 168 106 L160 124 L70 128 Z" fill="#1F2937" />

      {/* rabeta */}
      <path d="M54 108 C46 108 40 116 46 124 L74 124 L70 108 Z" fill={cor} />

      {/* tanque */}
      <path
        d="M158 100 C180 68 244 66 280 88 L288 108 C250 100 200 106 164 122 Z"
        fill={cor}
      />
      <path d="M176 92 C200 78 236 78 262 90" stroke="#fff" strokeOpacity="0.35" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* guidão e farol */}
      <path d="M278 78 L304 64 L326 66" stroke="#1F2937" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M300 86 C312 70 336 72 340 90 L316 98 Z" fill={cor} />
      <ellipse cx="336" cy="90" rx="8" ry="10" fill="#FEF9C3" stroke="#CBD5E1" strokeWidth="2" />

      {/* paralama dianteiro */}
      <path d="M296 122 C316 104 350 110 366 132 L352 138 C340 124 318 122 304 134 Z" fill={cor} />
    </svg>
  );
}
