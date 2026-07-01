# VYD — Overlays

Camadas flutuantes: dialog/modal, drawer, menu/dropdown, popover, tooltip e toolbar.
Empilhamento por `--vyd-z-*`, elevação por `--vyd-shadow-*`. Adicionado na **v0.7.0**.

## Dialog / modal (`<dialog>` nativo)

Usa o elemento **`<dialog>`** — foco-trap, `Esc` e backdrop já vêm do navegador.

```html
<dialog class="vyd-dialog">
  <div class="vyd-dialog__head">
    <span class="vyd-dialog__title">Gerar memorial</span>
    <button class="vyd-dialog__close"><svg class="vyd-icon"><use href="#vyd-icon-close"/></svg></button>
  </div>
  <div class="vyd-dialog__body">Confirma a geração para VYD-OBR-0421?</div>
  <div class="vyd-dialog__foot">
    <button class="vyd-btn vyd-btn--ghost">Cancelar</button>
    <button class="vyd-btn">Gerar</button>
  </div>
</dialog>
<script>
  document.querySelector('.vyd-dialog').showModal();  // abre modal
</script>
```

## Drawer / sheet

Variante do dialog ancorada à borda: `.vyd-drawer` + `--right` / `--left` / `--bottom`.

## Menu · Popover · Tooltip · Toolbar (CSS)

- `.vyd-menu` + `.vyd-menu__item` (`--danger`, `[disabled]`), `.vyd-menu__sep`,
  `.vyd-menu__label`.
- `.vyd-popover` — painel flutuante genérico.
- `.vyd-tooltip-wrap` > `.vyd-tooltip` — **CSS puro** (aparece em `:hover`/`:focus-within`).
- `.vyd-toolbar` + `.vyd-toolbar__sep` — barra flutuante de comandos.

> Menu/popover em CSS puro são só a **superfície**; o posicionamento e o abrir/fechar
> ficam com o app (ou use o `@vyd/react` abaixo, que já resolve).

## Em React (`@vyd/react`) — com comportamento

Todos os overlays interativos são **client components** (`'use client'`).

```tsx
import { Dialog, Drawer, Menu, MenuItem, MenuSeparator, MenuLabel,
         Popover, Tooltip, Toolbar, Button } from "@vyd/react";

// Dialog controlado (foco-trap/ESC/backdrop nativos)
const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>Gerar memorial</Button>
<Dialog open={open} onClose={() => setOpen(false)} title="Gerar memorial"
  footer={<>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
    <Button onClick={confirm}>Gerar</Button>
  </>}>
  Confirma a geração para VYD-OBR-0421?
</Dialog>

// Drawer (mesma API + side)
<Drawer open={o} onClose={close} side="right" title="Propriedades">…</Drawer>

// Menu (abre no clique, fecha por clique-fora / ESC; posicionado no trigger)
<Menu align="end" trigger={<Button variant="ghost">Ações</Button>}>
  <MenuLabel>Ações</MenuLabel>
  <MenuItem icon="edit" onClick={edit}>Editar</MenuItem>
  <MenuItem icon="download" onClick={exportar}>Exportar</MenuItem>
  <MenuSeparator />
  <MenuItem icon="close" danger onClick={remove}>Excluir</MenuItem>
</Menu>

// Popover genérico
<Popover trigger={<Button variant="ghost">Filtro</Button>}>…</Popover>

// Tooltip (CSS)
<Tooltip content="Medir distância"><Button variant="ghost"><Icon name="measure"/></Button></Tooltip>
```

## Acessibilidade & comportamento

- **Dialog/Drawer**: `<dialog>` faz foco-trap, `Esc` (evento `cancel`) e backdrop.
  O componente React fecha via `onClose` (ESC e clique no backdrop).
- **Menu/Popover**: fecham por **clique-fora** e **`Esc`**; reposicionam em scroll/resize.
  `role="menu"`/`menuitem`. Prefira o React p/ o comportamento completo.
- **Tooltip**: apenas dica curta; nunca coloque conteúdo essencial só no tooltip.
- **z-index**: use os tokens (`--vyd-z-dropdown/popover/modal/toast/tooltip`), nunca valores soltos.

> Fundações (z-index/elevação/opacidade) em [FOUNDATIONS.md](FOUNDATIONS.md).
> Demo: [`../demo/overlays.html`](../demo/overlays.html).
