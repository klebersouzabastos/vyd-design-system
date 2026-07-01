# VYD — Fundações (Fase 0)

Tokens e mecanismos de base que sustentam todos os componentes. Adicionados na
**v0.3.0** (aditivos ao contrato `--vyd-*`).

## Z-index (camadas)

Nunca use `z-index` mágico num app — use a escala. Ordem crescente de empilhamento:

| Token | Valor | Uso |
|---|---|---|
| `--vyd-z-base` | 0 | conteúdo normal |
| `--vyd-z-raised` | 1 | card elevado |
| `--vyd-z-sticky` | 100 | cabeçalhos sticky, status bar |
| `--vyd-z-dropdown` | 1000 | menus/dropdowns |
| `--vyd-z-overlay` | 1100 | backdrop/scrim |
| `--vyd-z-modal` | 1200 | modal/drawer |
| `--vyd-z-popover` | 1300 | popover |
| `--vyd-z-toast` | 1400 | notificações |
| `--vyd-z-tooltip` | 1500 | tooltip (sempre no topo) |

Tailwind: `z-modal`, `z-tooltip`, …

## Opacidade

| Token | Valor | Uso |
|---|---|---|
| `--vyd-opacity-disabled` | 0.5 | elementos desabilitados |
| `--vyd-opacity-muted` | 0.7 | conteúdo secundário atenuado |
| `--vyd-opacity-backdrop` | 0.6 | scrim atrás de modal/drawer |
| `--vyd-opacity-scrim` | 0.8 | scrim forte |

## Tamanhos de controle & ícone

| Token | Valor | | Token | Valor |
|---|---|---|---|---|
| `--vyd-size-control-sm` | 24px | | `--vyd-size-icon-sm` | 16px |
| `--vyd-size-control-md` | 28px _(padrão)_ | | `--vyd-size-icon-md` | 20px |
| `--vyd-size-control-lg` | 32px | | `--vyd-size-icon-lg` | 24px |

`.vyd-btn` e `.vyd-input` já usam a altura de controle. Modificadores: `.vyd-btn--sm`,
`.vyd-btn--lg`, `.vyd-input--sm`, `.vyd-input--lg`. Tailwind: `h-control-md`,
`w-icon-md`, …

## Densidade (runtime)

A altura de controle é dirigida por `--vyd-control-h`, trocável por atributo no `<html>`
(ou em qualquer container):

```html
<html data-vyd-density="comfortable">  <!-- controles a 32px -->
<html data-vyd-density="compact">       <!-- controles a 24px -->
<!-- padrão (sem atributo): md, 28px -->
```

## Elevação

Sombras mínimas e duras (hierarquia é por linha + densidade). Para **overlays**:

| Token | Uso |
|---|---|
| `--vyd-shadow-sm` | leve destaque |
| `--vyd-shadow-md` | popover/dropdown |
| `--vyd-shadow-lg` | **modal/drawer** (novo) |
| `--vyd-shadow-focus` | anel de foco (2px acento) |

## Breakpoints

Valores **literais** (media query não lê `var()`), expostos como tokens/`screens` do
Tailwind e para `matchMedia`:

| Token | Valor |
|---|---|
| `--vyd-bp-sm` | 640px |
| `--vyd-bp-md` | 768px |
| `--vyd-bp-lg` | 1024px |
| `--vyd-bp-xl` | 1280px |

```js
import vyd from "vyd-design-system";
matchMedia(`(min-width: ${vyd.breakpoint.lg})`); // via tokens.resolved.json p/ o px
```
No Tailwind: `md:…`, `lg:…` já funcionam (preset injeta `screens`).

## Estilos de texto (roles)

Classes que compõem os tokens de tipografia — use no lugar de fixar tamanho/peso:

| Classe | Papel |
|---|---|
| `.vyd-display` | número/título de destaque (3xl, bold) |
| `.vyd-title` | título de seção (2xl, bold) |
| `.vyd-heading` | cabeçalho (lg, semibold) |
| `.vyd-subheading` | subcabeçalho (md, semibold) |
| `.vyd-body` | corpo (base) |
| `.vyd-caption` | rótulo caixa-alta (xs, wide) |
| `.vyd-code` | dados/mono tabular (sm) |

## Foco & acessibilidade

- Todo controle interativo tem `:focus-visible` com `--vyd-shadow-focus`
  (anel de 2px na cor de acento) — **nunca** remova o foco sem substituir.
- Respeite `prefers-reduced-motion`: transições usam `--vyd-duration-*`; envolva
  animações não essenciais em `@media (prefers-reduced-motion: reduce)`.
- Contraste alvo **WCAG AA** (texto ≥ 4.5:1; UI/foco ≥ 3:1). Os pares
  `text-primary`/`bg-*` e `action-primary`/`text-on-accent` atendem AA no tema escuro.

> Consumo geral em [USAGE.md](USAGE.md); ribbon em [RIBBON.md](RIBBON.md); plano em
> [ROADMAP.md](ROADMAP.md).
