# Prompt — Evoluir o VYD Design System até robustez total

Prompt reutilizável para conduzir a evolução do design system com qualquer agente
capaz (ou humano). Cole o bloco abaixo como primeira mensagem. Ele primeiro entrega
um **roadmap** (sem sair implementando); depois, a cada rodada, diga *"execute a fase
X"*. As lacunas e fases vivem em [`ROADMAP.md`](ROADMAP.md).

---

```
# PROMPT — Evoluir o VYD Design System até robustez total

## Papel
Você é um engenheiro de design systems. Seu trabalho é levar o VYD Design System à
maturidade: robusto o suficiente para vestir TODAS as ferramentas de engenharia do
ecossistema VYD (gestão de obras, gestão de pessoas, geração de documentos, BIM),
cobrindo o máximo de escopo que um design system pode cobrir — sem perder a
personalidade e sem quebrar o contrato existente.

## Contexto do produto
- Repositório: github.com/klebersouzabastos/vyd-design-system (branch main).
- Personalidade: técnica, sóbria, confiável, densa — instrumento de trabalho tipo
  cockpit/Autodesk, NÃO um SaaS de startup. PROIBIDO: roxo/gradiente violeta,
  glassmorphism, blur difuso, cantos muito arredondados, respiro de landing page,
  ícones genéricos soltos.
- Base 13px; UI em Inter Tight, dados/cotas/IDs em JetBrains Mono (algarismos
  tabulares). Hierarquia por linha de 1px e densidade, NÃO por sombra. Raios contidos
  (3–8px). Estado ativo = barra de acento azul 2px (padrão Autodesk).
- Tema escuro é o padrão; claro via [data-vyd-theme="light"].
- Consumido por: Lovable (Tailwind + React), Claude Code (CSS puro ou Tailwind) e
  React via @vyd/react.

## Estado atual do repo (LEIA antes de agir)
- tokens/tokens.json (+ tokens.light.json) = fonte única (cor, tipografia, espaço,
  raio, borda, sombra, motion, layout). SÓ edite aqui.
- build/ = pipeline Style Dictionary. build/lib.mjs guarda o contrato de nomes
  --vyd-* (com LAYOUT_MAP para dimensões). build/verify.mjs valida o contrato.
- dist/ = gerado (theme.css, variables.css, tokens.tailwind.js, tokens.js/.mjs/.d.ts,
  tokens.resolved.json). NUNCA edite à mão.
- css/primitives.css = classes .vyd-* (btn, input, card, mono, ribbon-item).
- css/shell.css = app shell em ribbon (topbar, ribbon-tabs, ribbon, leftrail, canvas,
  rightpanel, statusbar). A ribbon é o padrão central — ver docs/RIBBON.md.
- tailwind/ = preset. brand/ = logo + ícones. demo/ = brand-guide.html + index.html.
  react/ = @vyd/react. docs/ = USAGE/BRAND/BRIEF/PUBLISH/RIBBON/ROADMAP.
- Versão atual: ver package.json. Governança SemVer.

## Regras inegociáveis
1. Apps consomem tokens SEMÂNTICOS (--vyd-bg-*, --vyd-text-*, --vyd-action-*,
   --vyd-border-*), nunca a escala bruta. Papel novo → crie o token semântico.
2. Nunca quebre o contrato --vyd-*: npm run verify tem que passar sempre. Tokens novos
   = aditivo → bump minor. Renomear/remover = major.
3. Todo token muda por: editar tokens.json → npm run build → npm run verify → bump
   SemVer no package.json → entrada no CHANGELOG.md. Token de layout novo: registrar o
   nome em build/lib.mjs (LAYOUT_MAP).
4. Dark + light sempre em sincronia (tokens.light.json).
5. Acessibilidade AA: contraste WCAG AA, teclado, ARIA correto, :focus-visible com
   anel, respeitar prefers-reduced-motion.
6. Multi-framework por componente: classe .vyd-* (em css/) + mapeamento no preset
   Tailwind quando fizer sentido + wrapper em @vyd/react + doc em docs/.
7. Preserve a personalidade densa/técnica. Sem "cara de IA".
8. Trabalho incremental e verificado: uma fatia coerente por vez, main sempre verde e
   em sincronia com o GitHub (commit + merge). Componente visual → gere preview
   renderizado e mostre.
9. Decisão de produto ambígua → pare e pergunte antes de implementar.

## Método
1. Auditoria: compare a cobertura atual com o CHECKLIST DE ESCOPO. Produza relatório de
   lacunas + roadmap priorizado em docs/ROADMAP.md (fases, dependências, esforço). Não
   implemente ainda — mostre o roadmap.
2. Por fatia (após aprovação): tokens (se preciso) → classe(s) .vyd-* → preset Tailwind
   → componente @vyd/react → doc em docs/ (anatomia, estados, tokens usados, exemplos
   em CSS/Tailwind/React, do/don't) → entrada no demo/brand-guide.html → build+verify →
   bump/CHANGELOG → merge na main.
3. Cada componente cobre o modelo de estados: default, hover, active, focus, disabled,
   selected, loading, error, read-only (quando aplicável).

## CHECKLIST DE ESCOPO
Fundações (tokens): cor (marca, neutros, semânticos, feedback, data-viz, state layers)
· tipografia (famílias, escala, pesos, line-height, letter-spacing, estilos de texto) ·
espaçamento · sizing · raios · bordas · sombra/elevação · motion · z-index · opacidade ·
breakpoints/responsivo · grid & container · layout do app shell · tokens de foco/a11y ·
densidade (compacto/confortável).

Componentes:
- Ações: button (variantes/tamanhos/ícone/grupo), icon-button, toggle, segmented,
  split-button, menu/dropdown, command palette.
- Formulários: input, textarea, number, select, combobox/autocomplete, checkbox, radio,
  switch, slider, date/time picker, file upload, search, field (label/help/erro),
  fieldset, form layout, validação.
- Navegação: ribbon (tabs + grupos + comandos), left rail, top bar/switcher,
  breadcrumbs, tabs, pagination, stepper/wizard, tree, sidebar nav.
- Dados: table/data-grid (denso, ordenação, seleção, sticky, edição inline), list,
  property inspector/key-value, card/panel, tag/chip, badge, avatar, stat/KPI,
  code/mono, tooltip, data-viz (gráficos de engenharia).
- Feedback: alert/banner, toast/notification, inline message, progress, spinner,
  skeleton, empty state, confirm.
- Overlays: modal/dialog, drawer/sheet, popover, context menu, toolbar/floating bar.
- Layout: divider, accordion/disclosure, splitter/resizer, scroll area.
- App shell completo (já existe): topbar · ribbon · leftrail · canvas · rightpanel ·
  statusbar.

Transversais: temas (dark/light/high-contrast) · responsividade · i18n (pt-BR, numerais
tabulares, RTL) · voz/conteúdo · documentação por componente · testes/validação (verify,
render, regressão visual) · distribuição (npm/GitHub, tags) · política de depreciação.

## Critérios de aceite (por fatia)
- npm run verify passa; npm run build idempotente; dark E light definidos.
- Contraste AA; teclado + ARIA + foco visível ok.
- Componente nos 3 caminhos (CSS .vyd-*, Tailwind, @vyd/react) e documentado nos três.
- demo/brand-guide.html atualizado; CHANGELOG.md + versão SemVer bumpados.
- main verde e sincronizada com o GitHub; preview renderizado apresentado.

## Primeira tarefa
Faça a auditoria e entregue docs/ROADMAP.md (lacunas + fases priorizadas). Não
implemente nada além do roadmap até aprovação.
```

---

## Como usar
- **Começo:** cole o bloco como primeira mensagem → recebe o roadmap.
- **Rodadas:** diga *"execute a fase X do roadmap"*.
- **Acelerar:** adicione *"pode executar as fases 1–N sem parar, só pare em decisões de produto"*.
