# VYD — Brand assets

> **Status: export oficial — padrão único.** Toda a marca usa a geometria **exata**
> do brand guide selecionado: cubo isométrico em **wireframe** com a **face-topo**
> preenchida (módulo 3D / BIM-volume), arestas internas marcando o módulo. Vale para
> os SVGs de logo (`vyd-symbol`, `vyd-symbol-mono`, `vyd-lockup`, `vyd-lockup-negative`)
> **e** para os ícones (`icons/`, derivados de `favicon.svg`). Cores na escala
> blueprint, on-brand.
>
> Os ícones usam o **mesmo** símbolo wireframe, apenas com as arestas levemente
> reforçadas (2 / 1.2) para legibilidade a ≤16px — sem mudar o desenho nem as cores.

## Logo

| Arquivo | Uso |
|---|---|
| `vyd-symbol.svg` | Símbolo (cubo wireframe + face-topo) — fundo escuro. |
| `vyd-symbol-mono.svg` | Símbolo monocromático (`currentColor`). Stamps, print, fallback. |
| `vyd-lockup.svg` | Símbolo + "VYD" + tagline — **positiva** (fundo chrome escuro). |
| `vyd-lockup-negative.svg` | Lockup para **fundo claro** (wordmark em neutro escuro). |

Cores (dos tokens): arestas externas `--vyd-blueprint-300` (`#6B9CE0`), face-topo
`--vyd-blueprint-500` (`#1E5FC4`), arestas internas `--vyd-neutral-300` (`#3A4350`),
wordmark `--vyd-text-primary`. Na negativa: arestas `--vyd-blueprint-700`, internas
neutro claro, wordmark neutro escuro.

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

Os PNGs/ICO são derivados de `icons/favicon.svg` (já no símbolo oficial). Se editar
o SVG, regenere com:

```bash
pip install cairosvg pillow
npm run icons          # = python3 build/make-icons.py
```
