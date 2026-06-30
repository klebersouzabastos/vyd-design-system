# VYD — Brand assets

> **Status: export oficial.** Os SVGs de logo (`vyd-symbol`, `vyd-symbol-mono`,
> `vyd-lockup`, `vyd-lockup-negative`) usam a geometria **exata** do brand guide
> selecionado: cubo isométrico em **wireframe** com a **face-topo** preenchida
> (módulo 3D / BIM-volume), arestas internas marcando o módulo. Cores na escala
> blueprint, on-brand.
>
> Os **ícones** em `icons/` (favicon/PWA) mantêm uma variante de **faces tonais
> sólidas** — mesma geometria, sem traços finos — porque a ≤16px o wireframe perde
> legibilidade. Regenere-os a partir do oficial só se quiser unificar o estilo
> (ver "Regenerar os ícones").

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

Os PNGs/ICO são derivados de `icons/favicon.svg`. Depois de trocar o SVG (ex. pelo
export oficial), rode:

```bash
pip install cairosvg pillow
npm run icons          # = python3 build/make-icons.py
```

Substitua primeiro `icons/favicon.svg` e `vyd-symbol.svg` pelo export oficial.
