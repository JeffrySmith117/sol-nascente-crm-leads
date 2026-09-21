import MotoArt from "./MotoArt";
import { useImagemExistente } from "./useImagem";

interface MotoFotoProps {
  slug: string;
  alt: string;
  cor?: string;
  className?: string;
}

// procura a foto da moto em /public/motos/<slug>.(webp|png|jpg). Enquanto ela não existir (ou não
// carregar), mostra a ilustração vetorial, então o site nunca fica com imagem quebrada.
const EXTENSOES = ["webp", "png", "jpg"] as const;

export default function MotoFoto({ slug, alt, cor, className }: MotoFotoProps) {
  const src = useImagemExistente(`/motos/${slug}`, EXTENSOES);

  if (!src) return <MotoArt cor={cor} className={className} />;

  return <img src={src} alt={alt} decoding="async" className={`${className ?? ""} object-contain`} />;
}
