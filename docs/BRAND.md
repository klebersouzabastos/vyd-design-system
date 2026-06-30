# VYD — Marca & identidade

Registro do alinhamento entre o **brand guide** (gerado no Claude Design) e os
tokens deste repositório.

## Guia visual

- Documento: **VYD Brand & UI Style Guide** (Claude Design, tema escuro).
- Personalidade: técnico, sóbrio, confiável, denso — instrumento de engenharia,
  não SaaS. Evita: roxo/violeta, glassmorphism, blur, cantos muito arredondados,
  espaçamento de landing page.

## Alinhamento com `tokens/tokens.json` (conferido)

O guia usa **exatamente** os valores do token source — sem divergência:

| Item | Guia | Token |
|---|---|---|
| Marca primária | `#1E5FC4` | `color.brand.blueprint.500` |
| Tons de marca | `#6B9CE0` `#143F86` `#0B2245` | `blueprint.300/700/900` |
| Chrome / painel / canvas | `#0D1117` `#161B22` `#1F2630` | `neutral.0/50/100` |
| Bordas / txt secundário / txt primário | `#3A4350` `#7B8794` `#E1E6EB` | `neutral.300/500/800` |
| Feedback | `#2E9E6B` `#D9920A` `#D24545` | `feedback.success/warning/danger` |
| Tipografia | Inter Tight + JetBrains Mono, base 13px | `typography.*` |
| Formas | raio 3–8px, linha 1px, acento ativo 2px | `radius.*`, `border.width.*` |
| Grid | base 4px | `space.*` |

Conclusão: **nenhuma mudança de token é necessária** para alinhar ao guia.

## Logo / símbolo (decisão)

O guia evoluiu o que ainda não estava no token source: o **símbolo**.

- Monograma **VYD** + símbolo geométrico, versões positiva (sobre chrome) e
  negativa (sobre claro).
- Exploração de símbolo convergiu para a **família isométrica**; selecionado:
  - **C · Cubo isométrico** — face-topo, referência BIM/volume (**SELECIONADO**).
  - D · Volume aramado (wireframe, aresta-guia em acento azul).
  - E · Módulo seccionado (topo 2×2, BIM paramétrico).

### Assets no repo (aproximação token-based)

Criados em `brand/` a partir dos tokens (ver `brand/README.md`):

- **Logo**: `vyd-symbol.svg` (positiva), `vyd-symbol-mono.svg` (monocromático),
  `vyd-lockup.svg` (positiva), `vyd-lockup-negative.svg` (fundo claro).
- **Ícones** (`brand/icons/`): `favicon.svg/.ico`, PNGs 16–64, `apple-touch-icon`,
  PWA `icon-192/512` + `icon-512-maskable`, `site.webmanifest`. Regenerar:
  `npm run icons` (cairosvg + Pillow).

O acento e os neutros saem dos tokens (`--vyd-blueprint-*`, `--vyd-neutral-*`),
então o logo permanece consistente se o tema mudar.

### Pendência

O SVG **exato** do brand guide está num sandbox isolado (`claudeusercontent.com`)
e não é extraível por automação. Quando quiser fidelidade 100%: exporte pelo
**Share/Export** do Claude Design e substitua `brand/vyd-symbol.svg` +
`brand/icons/favicon.svg`, depois rode `npm run icons`. Ideal converter o wordmark
para outlines (Inter Tight).
