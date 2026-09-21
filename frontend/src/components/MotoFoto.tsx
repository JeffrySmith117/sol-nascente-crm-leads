import MotoArt from "./MotoArt";
import { useImagemExistente } from "./useImagem";

interface MotoFotoProps {
  slug: string;
  alt: string;
  cor?: string;
  className?: string;
  // true (padrão): o branco da foto se funde ao palco claro. false: a foto é exibida como está
  // (usado no destaque do topo, onde a foto preenche o painel inteiro).
  mesclar?: boolean;
}

// procura a foto da moto em /public/motos/<slug>.(webp|png|jpg). Enquanto ela não existir (ou não
// carregar), mostra a ilustração vetorial, então o site nunca fica com imagem quebrada.
const EXTENSOES = ["webp", "png", "jpg"] as const;

// As fotos têm fundo branco e são exibidas sobre um "palco" claro. O mix-blend-multiply faz o branco
// da foto assumir a cor do palco (sem retângulo branco aparecendo), mantendo sombras e a moto intactas.
export default function MotoFoto({ slug, alt, cor, className, mesclar = true }: MotoFotoProps) {
  const src = useImagemExistente(`/motos/${slug}`, EXTENSOES);

  if (!src) return <MotoArt cor={cor} className={className} />;

  return (
    <img
      src={src}
      alt={alt}
      decoding="async"
      className={`${className ?? ""} ${mesclar ? "object-contain mix-blend-multiply" : "object-cover"}`}
    />
  );
}
