# Exemplos — VYD Design System em React

Apps mínimos que **consomem** o design system (não redefinem nada): importam
`@vyd/design-system/theme.css` + `shell.css` e montam o **app shell invariante**
com componentes de `@vyd/react`.

| Pasta | Stack | Workspace |
|---|---|---|
| `react-vite/` | React 19 + Vite 6 | `@vyd/example-react-vite` |
| `nextjs/` | React 19 + Next 15 (App Router) | `@vyd/example-nextjs` |

A partir da raiz do repo (workspaces):

```bash
npm install                                # instala todos os workspaces de uma vez

npm run dev   -w @vyd/example-react-vite    # http://localhost:5173
npm run build -w @vyd/example-react-vite

npm run dev   -w @vyd/example-nextjs        # http://localhost:3000
npm run build -w @vyd/example-nextjs
```

Os dois renderizam a **mesma** tela (réplica de `demo/index.html` em React),
mostrando que React, CSS puro e Tailwind consomem a mesma fonte de verdade.
O exemplo Next traz o app shell num componente `'use client'` (estado do rail
colapsável); o resto roda como server component.
