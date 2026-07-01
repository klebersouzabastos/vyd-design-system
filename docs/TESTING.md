# VYD — Testes & regressão

Duas camadas, com papéis diferentes. Introduzido na **v1.0.0**.

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

### Baselines são sensíveis ao ambiente

Renderização de fonte/antialias muda entre máquinas, então **baselines geradas no
seu Mac não batem com o Linux do CI**. Regra:

- **Sempre gere/commite baselines no mesmo runner** — o container de CI
  (`ubuntu-latest` + `npx playwright install chromium`). Localmente, use o mesmo via
  Docker se precisar regenerar fora do CI:
  ```bash
  docker run --rm -v "$PWD":/w -w /w mcr.microsoft.com/playwright:v1.48.0-jammy \
    sh -c "npm install && npm run build && npm run test:visual:update"
  ```
- Tolerância já configurada (`maxDiffPixelRatio: 0.01`) para ruído de antialias.
- Fonts web via `@import` (Google Fonts) podem faltar offline; o runner de CI tem
  rede, então as baselines saem estáveis lá.

### Por que não é gate obrigatório (ainda)

O job `visual` roda com `continue-on-error: true` e sobe os snapshots como
artefato. Vira gate assim que houver um lote de baselines commitado a partir do
runner de CI (rode o job com `--update-snapshots`, baixe o artefato, commite em
`test/__screenshots__/`, e remova o `continue-on-error`). Preferimos **sem
baseline** a uma baseline que só bate numa máquina — falso-verde é pior que
ausência de teste.

## Escopo de teste por camada

- **Tokens/CSS** → verify (contrato) + visual (aparência).
- **`vyd-react`** → typecheck (tipos) + visual (as demos exercitam as classes que
  os componentes emitem).
- **Apps consumidores** → responsáveis pelos próprios testes; fixam a versão do VYD
  (SemVer, ver [GOVERNANCE.md](GOVERNANCE.md)).

> Publicação e versionamento em [PUBLISH.md](PUBLISH.md) / [GOVERNANCE.md](GOVERNANCE.md).
