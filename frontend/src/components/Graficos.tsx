// gráficos simples em SVG/HTML puro (sem biblioteca), suficientes para o painel

const dois = (n: number) => String(n).padStart(2, "0");
const chaveDia = (d: Date) => `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;

// ---------------------------------------------------------------- leads por dia

// no celular mostra 7 dias (o gráfico fica legível), a partir de sm mostra 14
export function GraficoBarrasDia({ datas }: { datas: string[] }) {
  return (
    <>
      <div className="hidden sm:block">
        <BarrasPorDia datas={datas} quantidadeDias={14} largura={560} />
      </div>
      <div className="sm:hidden">
        <BarrasPorDia datas={datas} quantidadeDias={7} largura={330} />
      </div>
    </>
  );
}

function BarrasPorDia({
  datas,
  quantidadeDias: DIAS,
  largura,
}: {
  datas: string[];
  quantidadeDias: number;
  largura: number;
}) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dias = Array.from({ length: DIAS }, (_, i) => {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - (DIAS - 1 - i));
    return d;
  });

  const contagem = new Map<string, number>();
  for (const iso of datas) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) continue;
    const chave = chaveDia(d);
    contagem.set(chave, (contagem.get(chave) ?? 0) + 1);
  }
  const valores = dias.map((d) => contagem.get(chaveDia(d)) ?? 0);
  const maximo = Math.max(...valores);
  const topo = maximo <= 4 ? 4 : Math.ceil(maximo / 2) * 2;

  const altura = 190;
  const margemEsq = 26;
  const margemBaixo = 26;
  const margemTopo = 14;
  const areaW = largura - margemEsq - 6;
  const areaH = altura - margemBaixo - margemTopo;
  const passo = areaW / DIAS;
  const barra = passo * 0.6;
  const y = (v: number) => margemTopo + areaH - (v / topo) * areaH;

  return (
    <svg
      viewBox={`0 0 ${largura} ${altura}`}
      className="w-full"
      role="img"
      aria-label={`Leads recebidos nos últimos ${DIAS} dias`}
    >
      {[0, topo / 2, topo].map((v) => (
        <g key={v}>
          <line x1={margemEsq} x2={largura - 6} y1={y(v)} y2={y(v)} stroke="#E2E8F0" strokeDasharray={v === 0 ? "" : "3 4"} />
          <text x={margemEsq - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="#94A3B8">
            {v}
          </text>
        </g>
      ))}
      {valores.map((v, i) => {
        const x = margemEsq + i * passo + (passo - barra) / 2;
        const ehHoje = i === DIAS - 1;
        const d = dias[i];
        return (
          <g key={i}>
            <title>{`${dois(d.getDate())}/${dois(d.getMonth() + 1)}: ${v} lead(s)`}</title>
            <rect
              x={x}
              y={y(v)}
              width={barra}
              height={Math.max(margemTopo + areaH - y(v), v > 0 ? 2 : 0)}
              rx={3}
              fill={ehHoje ? "#E10A2B" : "#F4A3AF"}
            />
            {v > 0 && (
              <text x={x + barra / 2} y={y(v) - 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#475569">
                {v}
              </text>
            )}
            {(i % 2 === 1 || ehHoje) && (
              <text x={x + barra / 2} y={altura - 8} textAnchor="middle" fontSize="9" fill="#94A3B8">
                {`${dois(d.getDate())}/${dois(d.getMonth() + 1)}`}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------- rosca (donut)

export interface Segmento {
  rotulo: string;
  valor: number;
  cor: string;
}

export function GraficoRosca({ segmentos, rotuloCentro }: { segmentos: Segmento[]; rotuloCentro: string }) {
  const raio = 52;
  const circunferencia = 2 * Math.PI * raio;
  const total = segmentos.reduce((soma, s) => soma + s.valor, 0);
  let acumulado = 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      <svg viewBox="0 0 140 140" className="h-40 w-40 shrink-0" role="img" aria-label="Leads por status">
        <circle cx="70" cy="70" r={raio} fill="none" stroke="#F1F5F9" strokeWidth="18" />
        {segmentos.map((s) => {
          const tamanho = total === 0 ? 0 : (s.valor / total) * circunferencia;
          const deslocamento = -acumulado;
          acumulado += tamanho;
          return tamanho === 0 ? null : (
            <circle
              key={s.rotulo}
              cx="70"
              cy="70"
              r={raio}
              fill="none"
              stroke={s.cor}
              strokeWidth="18"
              strokeDasharray={`${tamanho} ${circunferencia - tamanho}`}
              strokeDashoffset={deslocamento}
              transform="rotate(-90 70 70)"
            >
              <title>{`${s.rotulo}: ${s.valor}`}</title>
            </circle>
          );
        })}
        <text x="70" y="68" textAnchor="middle" fontSize="28" fontWeight="800" fill="#0F172A">
          {total}
        </text>
        <text x="70" y="84" textAnchor="middle" fontSize="9" fill="#64748B">
          {rotuloCentro}
        </text>
      </svg>
      <ul className="space-y-1.5 text-xs text-slate-600">
        {segmentos.map((s) => (
          <li key={s.rotulo} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.cor }} />
            <span className="w-20">{s.rotulo}</span>
            <strong className="text-slate-900">{s.valor}</strong>
            <span className="text-slate-400">{total === 0 ? "0%" : `${Math.round((s.valor / total) * 100)}%`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------- barras horizontais

export interface ItemBarra {
  rotulo: string;
  valor: number;
}

export function BarrasHorizontais({ itens, cor = "#E10A2B" }: { itens: ItemBarra[]; cor?: string }) {
  const maximo = Math.max(1, ...itens.map((i) => i.valor));
  if (itens.length === 0) return <p className="py-6 text-center text-xs text-slate-400">Sem dados ainda.</p>;

  return (
    <ul className="space-y-3">
      {itens.map((item) => (
        <li key={item.rotulo}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="truncate font-semibold text-slate-700">{item.rotulo}</span>
            <strong className="text-slate-900">{item.valor}</strong>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(item.valor / maximo) * 100}%`, background: cor }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
