# VYD — Testes & regressão

Quatro camadas, com papéis diferentes. Introduzido na **v1.0.0**; unit + axe viram
gates na **v3.1.0**.

## 1. Gate determinístico (obrigatório) — `npm test`

Roda no CI em toda PR/push (`.github/workflows/ci.yml`, matriz Node 18/20/22). Sem
browser, **zero flake**. É o que realmente protege os apps que consomem o sistema:

| Passo | Comando | O que garante |
|---|---|---|
| Build | `npm run build` | Tokens → `dist/` + sprite de ícones geram sem erro. |
| Verify | `npm run verify` | **Contrato `--vyd-*` intacto**: toda variável do token source presente em `theme.css`/`variables.css`; blocos `light` e `high-contrast` com seus overrides; correção `on-accent`; preset Tailwind/JS válidos. |
| Typecheck | `npm run typecheck` | `vyd-react` compila em `strict` (`tsc --noEmit`). |
| Git limpo | `git diff --exit-code` | `dist/` commitado bate com o build — ninguém editou gerado à mão. |

Rode tudo local antes de abrir PR:

```bash
npm test          # build + verify + typecheck
```

## 2. Regressão visual (Playwright) — `npm run test:visual`

Captura cada página de `demo/` e o app shell nos três temas + três breakpoints,
comparando pixel-a-pixel contra baselines commitadas (`test/__screenshots__/`).
Pega quebras que o verify não vê: espaçamento, cor efetiva, layout da ribbon,
colapsos responsivos, espelhamento RTL.

```bash
npm run test:visual          # compara contra as baselines
npm run test:visual:update   # regera as baselines (após mudança intencional)
```

### Baselines: SEMPRE geradas pelo runner de CI (desde a 2.1.0)

Renderização de fonte/antialias muda entre máquinas, então baselines geradas na sua
máquina não batem com o Linux do CI. Por isso a regeneração é **automatizada no
próprio runner** via [`update-baselines.yml`](../.github/workflows/update-baselines.yml):

```bash
# regenerar baselines (após mudança visual INTENCIONAL):
git checkout -b baselines/minha-mudanca && git push -u origin HEAD
# → o workflow roda no runner de CI e commita os PNGs de volta NESSA branch
# → git pull, revise o diff visual, e faça merge na main
```

- O job `visual` do CI é **gate**: compara contra `test/__screenshots__/` e falha em
  qualquer diff acima de `maxDiffPixelRatio: 0.01` (ruído de antialias tolerado).
  Enquanto não existirem baselines commitadas (bootstrap), o passo é pulado com warning.
- Nunca commite baselines geradas fora do runner — falso-verde é pior que ausência
  de teste.

## 3. Acessibilidade automatizada (axe) — `npm run test:a11y`

`test/a11y.spec.ts` roda o axe-core (WCAG 2.1 A/AA) em todas as páginas de `demo/`
nos 3 temas e falha em violações **serious/critical**. **GATE desde a 3.1.0** —
o job `a11y` do CI falha a PR em qualquer violação (era report-only na 2.1.0).

Dica local (sandbox/offline): aponte um Chromium já instalado com
`VYD_CHROMIUM=/caminho/para/chromium npm run test:a11y`.

## 4. Testes unitários de interação (Vitest) — `npm test --workspace react`

`react/src/__tests__/` cobre o comportamento de teclado/ARIA dos componentes
interativos com Testing Library + jsdom: Menu (setas/ESC/modo controlado), Tabs
(roving tabindex, `aria-controls`), CommandPalette (`aria-activedescendant`),
Ribbon (Enter/Space, `aria-pressed`), Field (injeção de `id`/`aria-describedby`/
`aria-invalid` via contexto), Dialog nativo e `Button asChild`/refs.
**GATE desde a 3.1.0** (job `unit` do CI).

## Escopo de teste por camada

- **Tokens/CSS** → verify (contrato) + visual (aparência) + axe (a11y efetiva).
- **`vyd-react`** → typecheck (tipos) + vitest (interação/ARIA) + visual (as demos
  exercitam as classes que os componentes emitem).
- **Apps consumidores** → responsáveis pelos próprios testes; fixam a versão do VYD
  (SemVer, ver [GOVERNANCE.md](GOVERNANCE.md)).

> Publicação e versionamento em [PUBLISH.md](PUBLISH.md) / [GOVERNANCE.md](GOVERNANCE.md).
