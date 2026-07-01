# VYD — Formulários

Controles de formulário densos, sobre tokens semânticos, com todos os estados
(default / hover / focus / disabled / erro / read-only / checked). Adicionado na
**v0.5.0**. Importe `vyd-design-system/theme.css` (já inclui as classes).

## Field (composição)

Envolve rótulo + controle + ajuda/erro:

```html
<div class="vyd-field">
  <label class="vyd-field__label">Código da obra <span class="vyd-field__req">*</span></label>
  <input class="vyd-input vyd-mono" value="VYD-OBR-0421">
  <span class="vyd-field__help">Formato VYD-XXX-0000.</span>
</div>
```

Erro (borda vermelha + mensagem) via `aria-invalid`:

```html
<div class="vyd-field">
  <label class="vyd-field__label">E-mail</label>
  <input class="vyd-input" aria-invalid="true" value="kleber@">
  <span class="vyd-field__error">
    <svg class="vyd-icon vyd-icon--sm"><use href="#vyd-icon-alert-triangle"/></svg> E-mail inválido.
  </span>
</div>
```

## Controles (classes)

| Classe | Controle | Notas |
|---|---|---|
| `.vyd-input` | texto/number/… | altura de controle tokenizada; `--sm`/`--lg`; `:read-only`; `aria-invalid` |
| `.vyd-textarea` | multi-linha | `resize: vertical` |
| `.vyd-select` | select nativo | seta própria; `appearance:none` |
| `.vyd-checkbox` | checkbox | check branco sobre acento no `:checked` |
| `.vyd-radio` | radio | ponto de acento no `:checked` |
| `.vyd-switch` | toggle | checkbox estilizado; use `role="switch"` |
| `.vyd-range` | slider | `accent-color` de marca |
| `.vyd-input-group` | ícone + input | ícone à esquerda (ex.: busca) |
| `.vyd-choice` | label + controle | rótulo inline p/ checkbox/radio/switch |

Busca:
```html
<div class="vyd-input-group">
  <svg class="vyd-icon"><use href="#vyd-icon-search"/></svg>
  <input class="vyd-input" placeholder="Buscar…">
</div>
```

Escolha inline:
```html
<label class="vyd-choice"><input type="checkbox" class="vyd-checkbox" checked> Gerar memorial</label>
<label class="vyd-choice"><input type="checkbox" class="vyd-switch" role="switch"> Sincronizar</label>
```

## Em React (`vyd-react`)

```tsx
import { Field, Input, Select, Textarea, Checkbox, Radio, Switch, Range,
         Choice, SearchInput } from "vyd-react";

<Field label="Código da obra" required help="Formato VYD-XXX-0000.">
  <Input className="vyd-mono" defaultValue="VYD-OBR-0421" />
</Field>

<Field label="E-mail" error="E-mail inválido.">
  <Input aria-invalid defaultValue="kleber@" />
</Field>

<Field label="Disciplina">
  <Select><option>Arquitetura</option><option>Estrutura</option></Select>
</Field>

<SearchInput placeholder="Buscar elemento…" />

<Choice><Checkbox defaultChecked /> Gerar memorial</Choice>
<Choice><Switch defaultChecked /> Sincronização automática</Choice>
<Range min={0} max={100} defaultValue={70} />
```

## Estados & acessibilidade

- **Foco**: `:focus-visible` com anel de acento (`--vyd-shadow-focus`); no estado de
  erro o anel é vermelho. Nunca remova o foco.
- **Erro**: use `aria-invalid="true"` no controle e associe a mensagem
  (`aria-describedby`); o `Field` React já marca a mensagem com `role="alert"`.
- **Disabled / read-only**: `disabled` (não interativo) vs `readonly` (valor fixo,
  copiável) — visual distinto.
- **Rótulo**: todo controle precisa de rótulo (via `Field` ou `<label>`); em
  checkbox/radio use `.vyd-choice` para clicar no texto também.
- **Switch**: `role="switch"` + `aria-checked` (o componente React já aplica).

> Fundações (sizing/densidade/foco) em [FOUNDATIONS.md](FOUNDATIONS.md); ícones em
> [ICONS.md](ICONS.md). Demo: [`../demo/forms.html`](../demo/forms.html).
