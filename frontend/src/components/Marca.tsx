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

// nome da loja gigante e bem clarinho, usado como marca d'água no fundo das telas administrativas.
// É texto (não a logo esticada): a logo tem fundo sólido e vira um retângulo feio nesse tamanho.
export function MarcaDagua() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 grid select-none place-items-center overflow-hidden"
    >
      <p className="titulo whitespace-nowrap text-center text-[18vw] leading-none text-brand opacity-[0.08] sm:text-[13vw]">
        Sol Nascente
      </p>
    </div>
  );
}
