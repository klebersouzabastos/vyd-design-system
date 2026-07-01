# VYD — Feedback & status

Comunicação de estado: alerts, toasts, progresso, carregamento e rótulos de status.
Cores dos tokens de feedback (`success/warning/danger/info`). Adicionado na **v0.6.0**.
Importe `@vyd/design-system/theme.css`.

## Alert / banner (`.vyd-alert`)

Mensagem inline com barra de acento + ícone. Variantes: (info, default) `--success`,
`--warning`, `--danger`.

```html
<div class="vyd-alert vyd-alert--warning">
  <svg class="vyd-icon vyd-alert__icon"><use href="#vyd-icon-alert-triangle"/></svg>
  <div class="vyd-alert__body">
    <span class="vyd-alert__title">2 colisões detectadas</span>
    <span class="vyd-alert__text">Revise os pilares P-12 e P-14.</span>
  </div>
  <button class="vyd-alert__close"><svg class="vyd-icon vyd-icon--sm"><use href="#vyd-icon-close"/></svg></button>
</div>
```

## Toast (`.vyd-toaster` + `.vyd-toast`)

`.vyd-toaster` é a **região viva** fixa (`z-toast`, `aria-live="polite"`); coloque os
`.vyd-toast` dentro. Mesmas variantes do alert, elevado (`--vyd-shadow-lg`).

## Progress · Spinner · Skeleton

```html
<div class="vyd-progress"><div class="vyd-progress__bar" style="width:70%"></div></div>
<div class="vyd-progress vyd-progress--indeterminate"><div class="vyd-progress__bar"></div></div>

<span class="vyd-spinner"></span>          <!-- --sm / --lg -->

<span class="vyd-skeleton" style="width:70%"></span>
```
Animações respeitam `prefers-reduced-motion` (spinner desacelera; skeleton/indeterminate param).

## Empty state · Badge · Tag

```html
<div class="vyd-empty">
  <span class="vyd-empty__icon"><svg class="vyd-icon"><use href="#vyd-icon-folder"/></svg></span>
  <span class="vyd-empty__title">Nenhum documento</span>
  <span class="vyd-empty__text">Gere o memorial para começar.</span>
  <button class="vyd-btn">Gerar</button>
</div>

<span class="vyd-badge vyd-badge--primary">12</span>   <!-- neutral/primary/success/warning/danger; --dot -->
<span class="vyd-tag">concreto <button class="vyd-tag__close">…</button></span>  <!-- --accent -->
```

## Em React (`@vyd/react`)

```tsx
import { Alert, Toaster, Toast, Progress, Spinner, Skeleton, EmptyState, Badge, Tag } from "@vyd/react";

<Alert variant="warning" title="2 colisões detectadas" onClose={dismiss}>
  Revise os pilares P-12 e P-14.
</Alert>

<Toaster>
  <Toast variant="success" title="Salvo" onClose={close}>Alterações salvas.</Toast>
</Toaster>

<Progress value={70} />
<Progress indeterminate />
<Spinner /> <Skeleton width="70%" />

<EmptyState icon="folder" title="Nenhum documento"
  description="Gere o memorial para começar."
  action={<button className="vyd-btn">Gerar</button>} />

<Badge variant="primary">12</Badge>
<Tag onRemove={remove}>Arquitetura</Tag>
```

## Acessibilidade

- `alert` (danger) usa `role="alert"`; demais `role="status"`. `Toaster` é
  `aria-live="polite"` — anuncia toasts a leitores de tela.
- `Progress` expõe `role="progressbar"` + `aria-valuenow/min/max`.
- Ícone do alert é decorativo (a cor + texto carregam o significado; nunca **só** cor).

> Ícones em [ICONS.md](ICONS.md); fundações (z-index/elevação/motion) em
> [FOUNDATIONS.md](FOUNDATIONS.md). Demo: [`../demo/feedback.html`](../demo/feedback.html).
