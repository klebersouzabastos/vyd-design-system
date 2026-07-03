# Migração 2.x → 3.0 (vyd-design-system / vyd-react)

A **3.0.0** é a "Fundação 3.0": formato de tokens DTCG, cascade layers, tier de
marca white-label, state layers, motor OKLCH/P3 e densidade por component tokens.
**Todos os nomes `--vyd-*` e classes `.vyd-*` foram preservados** e a aparência
padrão é **pixel-idêntica** à 2.1 (provado por regressão visual). As quebras são
duas, e bem localizadas:

## 1. Cascade layers (`@layer`)

O CSS do VYD agora vive em `@layer vyd.tokens, vyd.components;`. Consequência
prática: **qualquer CSS não-layered do seu app vence os estilos do VYD**, sempre —
sem `!important`, sem depender de ordem de import.

- **Para 99% dos apps: nada a fazer.** Seus overrides ficam MAIS previsíveis.
- Se algum override seu dependia de PERDER para o VYD (raro), ou você usa
  tooling antigo que não entende `@layer`, use o escape hatch por 1 ciclo:
  ```css
  @import "vyd-design-system/theme.unlayered.css"; /* transição; será removido */
  ```

## 2. `tokens.json` agora é DTCG (2025.10)

O export `vyd-design-system/tokens.json` usa `$value`/`$type`/`$description`
(spec W3C estável — interopera com Figma Variables, Tokens Studio, Style
Dictionary). **Se você parseava `tokens.json` cru**, troque `node.value` por
`node.$value`. Quem consome CSS/Tailwind/JS não é afetado.
Dica: `dist/tokens.resolved.json` continua com o formato plano `{ nome: valor }`.

## Novidades que você ganha de graça

| Recurso | Como usar |
|---|---|
| **White-label** | Sobrescreva só `--vyd-brand-accent-{50..900}` e TODO o acento (botões, links, foco, viz-seq) re-tinge. `--vyd-blueprint-*` permanece como a marca VYD. |
| **State layers** | `var(--vyd-state-selected-bg)` / `var(--vyd-state-hover-bg)` prontos; receita única via `--vyd-state-*-mix`. |
| **Densidade** | `<html data-vyd-density="compact|comfortable">` — controles e linhas de tabela mudam juntos (component tokens). |
| **Wide-gamut P3** | Automático: em telas P3 o acento e a paleta viz ficam levemente mais vivos (`@media (color-gamut: p3)`, OKLCH). sRGB inalterado. |
| **Tooltip legível no light** | `--vyd-bg-tooltip`/`--vyd-text-tooltip` (consertou o preto-no-preto do tema claro). |
| **Reduced-motion total** | `prefers-reduced-motion` agora desliga TODAS as transições (zera `--vyd-duration-*`). |

## Gates novos (o build falha se violar)

`semantic-only` (nenhuma cor crua/escala bruta em `css/`), cobertura de
reduced-motion, presença/ordem das layers, cadeia de marca, bloco P3, formato
DTCG. Além dos já existentes (contrato `--vyd-*`, contraste AAA, shell
ribbon-only).
