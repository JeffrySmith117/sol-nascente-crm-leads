import type { ReactNode } from "react";
import { useImagemExistente } from "./useImagem";

interface ImagemMarcaProps {
  // caminho sem extensão, dentro de /public. Ex.: "/marca/logo" procura logo.svg, logo.png, logo.webp e logo.jpg
  caminho: string;
  alt: string;
  className?: string;
  // mostrado enquanto a imagem não existe (o site nunca fica com imagem quebrada)
  fallback?: ReactNode;
}

const EXTENSOES = ["svg", "png", "webp", "jpg"] as const;

export function ImagemMarca({ caminho, alt, className, fallback = null }: ImagemMarcaProps) {
  const src = useImagemExistente(caminho, EXTENSOES);
  if (!src) return <>{fallback}</>;
  return <img src={src} alt={alt} decoding="async" className={className} />;
}

// foto do mascote (o "boneco motoqueiro"): /public/marca/mascote.(png|webp|jpg|svg)
export function Mascote({ className }: { className?: string }) {
  return <ImagemMarca caminho="/marca/mascote" alt="Mascote da Sol Nascente Motos" className={className} />;
}

// logo da loja gigante e bem clarinha, usada como marca d'água no fundo das telas administrativas
export function MarcaDagua() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 grid place-items-center overflow-hidden">
      <div className="opacity-[0.08]">
        <ImagemMarca
          caminho="/marca/logo"
          alt=""
          className="w-[80vw] max-w-4xl select-none"
          fallback={<span className="titulo select-none text-[32vw] leading-none text-brand">SN</span>}
        />
      </div>
    </div>
  );
}
