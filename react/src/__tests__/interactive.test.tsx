import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Button } from '../primitives';
import { Field, Input } from '../forms';
import { Menu, MenuItem, MenuSeparator, Dialog } from '../overlays';
import { TabsRoot, Tabs, Tab, TabPanel } from '../nav';
import { CommandPalette } from '../command';
import { RibbonTabs, RibbonTab, RibbonItem } from '../shell';

describe('Button', () => {
  it('encaminha ref e aplica classes', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={(el) => { ref.current = el; }} variant="ghost">Ok</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveClass('vyd-btn', 'vyd-btn--ghost');
  });

  it('asChild funde o visual num <a> sem wrapper', () => {
    render(<Button asChild><a href="/x">Link</a></Button>);
    const a = screen.getByRole('link', { name: 'Link' });
    expect(a).toHaveClass('vyd-btn');
    expect(a.parentElement?.tagName).not.toBe('BUTTON');
  });
});

describe('Field — wiring ARIA', () => {
  it('liga label/erro ao controle (id, describedby, invalid, required)', () => {
    render(
      <Field label="Obra" required error="Obrigatório">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText(/Obra/);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-required', 'true');
    const desc = input.getAttribute('aria-describedby')!;
    expect(document.getElementById(desc)).toHaveTextContent('Obrigatório');
  });
});

describe('Menu (motor de overlay)', () => {
  it('abre pelo trigger, navega por setas e seleciona com Enter', async () => {
    const user = userEvent.setup();
    const onDup = vi.fn();
    render(
      <Menu trigger={<button>Ações</button>}>
        <MenuItem>Editar</MenuItem>
        <MenuSeparator />
        <MenuItem onClick={onDup}>Duplicar</MenuItem>
      </Menu>,
    );
    const trigger = screen.getByRole('button', { name: 'Ações' });
    expect(trigger).toHaveAttribute('aria-haspopup');
    await user.click(trigger);
    const menu = await screen.findByRole('menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const items = within(menu).getAllByRole('menuitem');
    expect(items.map((i) => i.textContent)).toEqual(['Editar', 'Duplicar']);
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onDup).toHaveBeenCalled();
  });

  it('modo controlado: open/onOpenChange', async () => {
    const user = userEvent.setup();
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <span data-testid="estado">{String(open)}</span>
          <Menu open={open} onOpenChange={setOpen} trigger={<button>Abrir</button>}>
            <MenuItem>Um</MenuItem>
          </Menu>
        </>
      );
    }
    render(<Host />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    expect(screen.getByTestId('estado')).toHaveTextContent('true');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});

describe('Tabs (WAI-ARIA)', () => {
  function Host() {
    const [v, setV] = useState('a');
    return (
      <TabsRoot value={v} onChange={setV}>
        <Tabs aria-label="Seções">
          <Tab value="a">Alfa</Tab>
          <Tab value="b">Beta</Tab>
        </Tabs>
        <TabPanel value="a">Conteúdo A</TabPanel>
        <TabPanel value="b">Conteúdo B</TabPanel>
      </TabsRoot>
    );
  }
  it('setas movem foco+seleção; painel troca; aria-controls ligado', async () => {
    const user = userEvent.setup();
    render(<Host />);
    const alfa = screen.getByRole('tab', { name: 'Alfa' });
    expect(alfa).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Conteúdo A');
    expect(document.getElementById(alfa.getAttribute('aria-controls')!)).toBe(screen.getByRole('tabpanel'));
    alfa.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Conteúdo B');
  });
});

describe('CommandPalette', () => {
  const commands = [
    { id: '1', label: 'Nova parede' },
    { id: '2', label: 'Nova laje' },
    { id: '3', label: 'Exportar folha' },
  ];
  it('filtra, anuncia o ativo via aria-activedescendant e seleciona', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSelect = vi.fn();
    render(
      <CommandPalette
        open
        onClose={onClose}
        commands={[{ ...commands[0] }, { ...commands[1], onSelect }, { ...commands[2] }]}
      />,
    );
    const input = screen.getByRole('combobox');
    await user.type(input, 'nova');
    const opts = screen.getAllByRole('option');
    expect(opts).toHaveLength(2);
    await user.keyboard('{ArrowDown}');
    expect(input.getAttribute('aria-activedescendant')).toBe(opts[1].id);
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});

describe('Ribbon — teclado', () => {
  it('RibbonItem dispara onClick no Enter/Space e bloqueia quando disabled', async () => {
    const user = userEvent.setup();
    const go = vi.fn();
    const blocked = vi.fn();
    render(
      <>
        <RibbonItem glyph="▣" label="Modelo" onClick={go} />
        <RibbonItem glyph="⬚" label="Níveis" disabled onClick={blocked} />
      </>,
    );
    const modelo = screen.getByRole('button', { name: /Modelo/ });
    modelo.focus();
    await user.keyboard('{Enter}');
    expect(go).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: /Níveis/ }));
    expect(blocked).not.toHaveBeenCalled();
  });

  it('RibbonTabs: setas movem entre abas', async () => {
    const user = userEvent.setup();
    const sel = vi.fn();
    render(
      <RibbonTabs aria-label="Ribbon">
        <RibbonTab selected>Início</RibbonTab>
        <RibbonTab onClick={sel}>Modelagem</RibbonTab>
      </RibbonTabs>,
    );
    screen.getByRole('tab', { name: 'Início' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(sel).toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Modelagem' }));
  });
});

describe('Dialog', () => {
  it('abre como modal e fecha no botão', async () => {
    const user = userEvent.setup();
    function Host() {
      const [open, setOpen] = useState(true);
      return (
        <Dialog open={open} onClose={() => setOpen(false)} title="Confirmar">
          corpo
        </Dialog>
      );
    }
    render(<Host />);
    expect(screen.getByText('Confirmar')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByText('Confirmar')).not.toBeVisible();
  });
});
