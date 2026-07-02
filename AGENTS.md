# AGENTS.md — Regras do VYD Design System (para IA)

> Este arquivo é para **agentes de IA** (Claude Code, Cursor, Lovable, Copilot…) que
> criam ou editam apps do ecossistema **VYD**. Siga estas regras **sem exceção**. Elas
> são o contrato visual — o `verify` do design system falha se forem violadas.

Pacotes: **`vyd-design-system`** (tokens + CSS + Tailwind + ícones) e **`vyd-react`**
(componentes React). Instale com `npm install vyd-design-system` (+ `vyd-react` se React).

---

## 🔴 REGRAS DURAS (nunca quebrar)

### 1. Navegação = RIBBON no topo. NUNCA menu lateral esquerdo.
- Toda tela VYD usa o padrão **ribbon (Autodesk/Microsoft)**: uma barra de **abas** no
  topo (seções de 1º nível) + uma **ribbon de comandos** agrupados logo abaixo (ações).
- **É PROIBIDO** criar sidebar / nav / drawer / menu na **lateral esquerda**. Não crie
  `<aside>` de navegação, "sidebar", "left nav", nem coluna de menu à esquerda.
- **Não há painéis laterais no shell.** O shell é **coluna única**: o **canvas ocupa a
  largura toda**. Se precisar de lista, inspetor ou propriedades, coloque como
  **conteúdo DENTRO do canvas** (um card, um painel flutuante, uma aba) — nunca como
  painel fixo lateral do shell.
- Estrutura do shell (classes de `vyd-design-system/shell.css`):
  `.vyd-app` › `.vyd-topbar` · `.vyd-ribbon-tabs` (opcional) · `.vyd-ribbon` ·
  `.vyd-canvas` (cheio) · `.vyd-statusbar`.
- Em React (`vyd-react`): `AppShell › TopBar · RibbonTabs · Ribbon · Canvas · StatusBar`.
  **Não existe** `LeftRail`/`RailItem`/`RightPanel` — se você procurar por eles, é porque
  está indo pelo caminho errado.

### 2. Só tokens semânticos. NUNCA cor solta.
- Use as variáveis/classes `--vyd-*` / `.vyd-*` (ou utilitários Tailwind do preset). Ex.:
  fundos `bg-chrome`/`bg-panel`/`bg-canvas`; texto `text-primary`/`text-secondary`;
  bordas `border-default`; acento `bg-action-primary` + `text-on-accent`.
- **Nunca** escreva hex/rgb literal nem invente cores, espaçamentos ou raios.

### 3. Texto legível (WCAG).
- **Texto de leitura = `text-primary`.** Use `text-secondary` só para meta não-essencial
  (rótulos, timestamps). Ambos já passam **AAA** nos temas — não reduza opacidade nem
  crie cinzas próprios.

### 4. Import obrigatório do CSS.
- Importe **uma vez** no entry do app: `import 'vyd-design-system/theme.css';`
  (e `'vyd-design-system/shell.css';` se usar o app shell).

---

## Padrões

- **Temas:** `dark` é o padrão. Alterne com `<html data-vyd-theme="light">` ou
  `"high-contrast"` (este último também auto-aplica em `prefers-contrast: more`).
- **Densidade/tipografia:** app técnico e denso — base **13px**, cantos contidos
  (`radius-md`), hierarquia por **linha de 1px**, não por sombra difusa.
- **"Ativo" é sempre uma barra de acento de 2px** (aba selecionada, comando ativo).
- **Componentes prontos:** botões `.vyd-btn`/`.vyd-btn--ghost`, `.vyd-input`, `.vyd-card`,
  `.vyd-table`, `.vyd-alert`, `.vyd-badge`, formulários, overlays, etc. Prefira-os a
  recriar do zero. Em React, use `vyd-react` (`Button`, `Field`, `Dialog`, `Table`…).

## Anti-exemplos (NÃO faça)

- ❌ Um `<aside class="sidebar">` com links de navegação à esquerda.
- ❌ "Vou colocar o menu na lateral e o conteúdo à direita."
- ❌ `background: #1E5FC4` / `color: #fff` hardcoded — use `bg-action-primary text-on-accent`.
- ❌ `color: #999` para texto secundário — use `text-secondary`.
- ❌ Painel de propriedades fixo na direita como parte do shell — vira conteúdo do canvas.

> Detalhes: [`docs/RIBBON.md`](docs/RIBBON.md) (anatomia da ribbon),
> [`docs/INTEGRATION.md`](docs/INTEGRATION.md) (como instalar/consumir),
> [`docs/FOUNDATIONS.md`](docs/FOUNDATIONS.md) (tokens).
