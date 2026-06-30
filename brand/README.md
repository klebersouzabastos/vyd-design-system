# VYD — Brand assets

> **Status: aproximação token-based.** Recriam a direção selecionada no brand guide
> (símbolo **cubo isométrico**, face-topo / BIM-volume). O SVG exato do guia vive num
> sandbox isolado (`claudeusercontent.com`) e não é extraível por automação — exporte
> pelo **Share/Export** do Claude Design e substitua estes arquivos quando quiser.
> As cores saem todas dos tokens, então já estão on-brand.

## Logo

| Arquivo | Uso |
|---|---|
| `vyd-symbol.svg` | Símbolo (cubo) colorido — fundo escuro. |
| `vyd-symbol-mono.svg` | Símbolo monocromático (`currentColor`, profundidade por opacidade). Stamps, print, fallback. |
| `vyd-lockup.svg` | Símbolo + "VYD" + tagline — **positiva** (fundo chrome escuro). |
| `vyd-lockup-negative.svg` | Lockup para **fundo claro** (wordmark em neutro escuro). |

Cores (dos tokens): face-topo `--vyd-blueprint-400`, esquerda `--vyd-blueprint-500`,
direita `--vyd-blueprint-700`, arestas `--vyd-blueprint-300`, wordmark `--vyd-text-primary`.

Regras: clear space ≥ uma face do cubo; tamanho mínimo símbolo 16px / lockup 96px;
não recolorir fora da escala blueprint, sem sombra/gradiente, sem rotação.

## Ícones (`icons/`)

| Arquivo | Uso |
|---|---|
| `favicon.svg` | Favicon vetorial (navegadores modernos). |
| `favicon.ico` | Favicon multi-res (16/32/48) para compatibilidade. |
| `favicon-16/32/48/64.png` | PNGs transparentes. |
| `apple-touch-icon.png` (180) | Ícone iOS (fundo chrome, iOS arredonda). |
| `icon-192.png` / `icon-512.png` | PWA (purpose `any`, fundo chrome arredondado). |
| `icon-512-maskable.png` | PWA `maskable` (cubo dentro da safe zone). |
| `site.webmanifest` | Manifest PWA com os ícones + `theme_color` `#0D1117`. |

### Wiring (cole no `<head>`)

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#0D1117">
```

## Regenerar os ícones

Os PNGs/ICO são derivados de `icons/favicon.svg`. Depois de trocar o SVG (ex. pelo
export oficial), rode:

```bash
pip install cairosvg pillow
npm run icons          # = python3 build/make-icons.py
```

Substitua primeiro `icons/favicon.svg` e `vyd-symbol.svg` pelo export oficial.
