import { useEffect, useState } from "react";

// procura, em ordem, <caminho>.<extensão> e devolve a URL da primeira que existir e for uma imagem
// de verdade (null enquanto procura ou se nenhuma existir). Assim a tela mostra o "plano B" desde o
// início e só troca pela foto quando ela carregar, sem piscar ícone de imagem quebrada.
export function useImagemExistente(caminho: string, extensoes: readonly string[]): string | null {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    setSrc(null);

    (async () => {
      for (const ext of extensoes) {
        const url = `${caminho}.${ext}`;
        const existe = await new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img.naturalWidth > 0);
          img.onerror = () => resolve(false);
          img.src = url;
        });
        if (cancelado) return;
        if (existe) {
          setSrc(url);
          return;
        }
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [caminho, extensoes]);

  return src;
}
