import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Consume the VYD design system: tokens + primitives, then the app-shell layout.
import '@vyd/design-system/theme.css';
import '@vyd/design-system/shell.css';

export const metadata: Metadata = {
  title: 'VYD — App shell (Next.js)',
  description: 'Exemplo do app shell invariante VYD consumindo @vyd/design-system + @vyd/react.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" data-vyd-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
