# Changelog

Todas as mudanças notáveis deste projeto são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/);
o projeto adere a [SemVer](https://semver.org/lang/pt-BR/).

Regra: **toda alteração de token** (valor, nome, adição, remoção) entra aqui com
o respectivo bump de versão. Apps fixam a versão que consomem.

## [Não lançado]

> Sem mudança no contrato de tokens `--vyd-*` (nenhum bump de versão exigido pela
> governança). Adições de camada React/exemplos e troca de assets de marca.

### Adicionado

- **`demo/brand-guide.html`**: o **Brand & UI Style Guide** completo (logo, paleta,
  tipografia, escala de espaçamento/raios, componentes) renderizado **a partir dos
  tokens `--vyd-*`** do repo — a seção de componentes usa as classes reais
  (`.vyd-btn`, `.vyd-input`, `.vyd-card`, `.vyd-ribbon-item`) e a seção 06 embute o
  app shell (`index.html`) via iframe. Reúne num só documento o guia visual (padrão
  Claude Design) e o app shell (padrão Autodesk). Estático, sem build.
- **`@vyd/react`** (`react/`): componentes React — wrappers finos sobre as classes
  `.vyd-*`, sem estilo próprio. Primitivas (`Button`, `Input`, `Card`, `Mono`,
  `CubeMark`) e o app shell completo (`AppShell`, `TopBar`, `Ribbon`, `RibbonItem`,
  `LeftRail`, `Canvas`, `RightPanel`, `Prop`, `StatusBar`, …). Distribuído como
  fonte TSX (o app transpila).
- **`examples/react-vite`** e **`examples/nextjs`**: apps de exemplo montando o app
  shell invariante, consumindo `@vyd/design-system` (`theme.css` + `shell.css`) e
  `@vyd/react`. Builds validados (Vite 6 + Next 15, React 19, TS strict).
- `workspaces` em `package.json` (`react`, `examples/*`) — dev-only, fora de `files`
  (não publicados com o pacote). `build`/`verify` do design system inalterados.

### Alterado

- **Símbolo oficial da marca — padrão único.** Toda a marca passa a usar a geometria
  **exata** do brand guide selecionado (cubo isométrico em **wireframe** com a
  **face-topo** destacada), eliminando a antiga aproximação de 3 faces sólidas. Cobre:
  - SVGs de logo: `brand/vyd-symbol.svg`, `vyd-symbol-mono.svg`, `vyd-lockup.svg`,
    `vyd-lockup-negative.svg`;
  - **ícones** `brand/icons/` — `favicon.svg` reescrito no wireframe (arestas 2 / 1.2
    para legibilidade ≤16px) e **todos os PNG/ICO regenerados** (`npm run icons`);
  - brand inline de `demo/index.html` e o cubo de `demo/app-shell-preview.svg`;
  - o componente `CubeMark` de `@vyd/react`.

## [0.1.0] — 2026-06-29

Primeira versão estruturada do design system como pacote publicável.

### Adicionado

- Estrutura de pacote: `/tokens` (fonte), `/css` (primitivas), `/dist` (build),
  `/tailwind`, `/docs`, `/build` (pipeline). `package.json` (`@vyd/design-system`),
  `LICENSE` (MIT), `.gitignore`, este changelog.
- Pipeline de build com **Style Dictionary** (`npm run build`) gerando a partir de
  `tokens/tokens.json`: `dist/theme.css`, `dist/variables.css`,
  `dist/tokens.tailwind.js` (preset), `dist/tokens.js` + `.mjs` + `.d.ts`,
  `dist/tokens.resolved.json`.
- Verificação automática (`npm run verify`) que garante que os nomes `--vyd-*`
  gerados continuam batendo com o contrato original e que não há tokens órfãos.
- Formalização do tema claro (`[data-vyd-theme="light"]`) em `tokens/tokens.light.json`
  — antes existia só no `theme.css`, sem fonte de verdade.
- Token semântico `--vyd-text-on-accent` (texto/ícone sobre superfície de acento).
- Primitivas de componente documentadas em `css/primitives.css` com estados
  normal / hover / active / focus / disabled (`.vyd-btn`, `.vyd-btn--ghost`,
  `.vyd-input`, `.vyd-card`, `.vyd-ribbon-item`, `.vyd-mono`).
- `docs/USAGE.md`: guia de consumo (CSS puro e Tailwind) e processo de mudança.

### Corrigido

- `.vyd-btn` usava `--vyd-neutral-1000` (escala bruta) para a cor do texto,
  violando a regra de ouro; agora usa o token semântico `--vyd-text-on-accent`.
- `dist/theme.css` passa a emitir `--vyd-space-0`, `--vyd-radius-none`,
  `--vyd-shadow-none` e `--vyd-ls-normal` (definidos em `tokens.json`, antes
  ausentes no CSS).

### Notas de migração

- Os valores e nomes de variáveis existentes (`--vyd-*`) foram preservados 1:1.
  Apps que já importavam `theme.css` continuam funcionando ao trocar para
  `dist/theme.css`. As únicas adições são os tokens citados acima.

[Não lançado]: https://github.com/<owner>/vyd-design-system/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/<owner>/vyd-design-system/releases/tag/v0.1.0
