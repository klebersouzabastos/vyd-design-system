# VYD — Ícones

Conjunto de ícones de linha para engenharia + UI. Estilo: **grid 24×24**, traço
**1.6** com pontas/juntas arredondadas, `fill:none`, `stroke:currentColor` (herda a
cor do contexto/estado). Adicionado na **v0.4.0**.

## Fonte & geração

- **Fonte:** `icons/<nome>.svg` (SVGs limpos — edite/adicione aqui).
- **Build** (`npm run build:icons`, também roda no `npm run build`) gera:
  - `dist/icons.svg` — **sprite** `<symbol>` para CSS/HTML.
  - `dist/icons.mjs` · `.js` · `.d.ts` — mapa `{ nome: markup }` + tipo `IconName`.
  - `react/src/icons.generated.ts` — mapa embutido do componente `<Icon>`.

## Tamanhos

Pelos tokens de ícone (Fase 0): `--vyd-size-icon-sm|md|lg` = 16 / 20 / 24px.
Classe `.vyd-icon` (md, padrão) + `.vyd-icon--sm` / `.vyd-icon--lg`.

## Consumo

### React (`vyd-react`) — recomendado (inline, sem sprite externo)
```tsx
import { Icon } from "vyd-react";

<Icon name="model" />
<Icon name="export" size="lg" title="Exportar" />   {/* title => acessível */}
```
`name` é tipado (`IconName`) — autocomplete e erro em nome inválido.

### CSS puro / Tailwind — sprite + `<use>`
Sirva `dist/icons.svg` e referencie por id `vyd-icon-<nome>`:
```html
<svg class="vyd-icon vyd-icon--lg"><use href="/assets/icons.svg#vyd-icon-model"/></svg>
```
> `<use>` externo exige **mesma origem (http/https)**. Ao abrir via `file://`, ou
> **inline o sprite uma vez** no documento (como faz `demo/index.html`) e use
> `href="#vyd-icon-model"`, ou copie o SVG-fonte direto.

### SVG direto
Copie `icons/<nome>.svg` para onde precisar (herda `currentColor`).

## Catálogo (40)

**UI:** `search settings user menu layers grid plus minus close check chevron-up
chevron-down chevron-left chevron-right alert-triangle info more edit download filter
eye folder bell home`

**Engenharia:** `model levels wall slab column dimension angle measure view-2d view-3d
sheet document export structure modules cube`

## Adicionar um ícone

1. Crie `icons/<nome>.svg` no padrão (viewBox 0 0 24 24, `stroke=currentColor`,
   `stroke-width=1.6`, sem `width/height` fixos).
2. `npm run build:icons` (regenera sprite + mapas + tipos).
3. Já disponível como `<Icon name="<nome>">` e `#vyd-icon-<nome>`. Bump minor + CHANGELOG.

## Regras

- Só `currentColor` — a cor vem do contexto/estado (nunca cor fixa no ícone).
- Mantenha o traço **1.6** e o grid **24** para consistência óptica.
- Ícone é decorativo por padrão (`aria-hidden`); dê `title`/`aria-label` quando ele
  **for** a única informação (ex. icon-button sem texto).
