import { cloneElement, isValidElement } from 'react';
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { cx } from './cx';

/* =====================================================================
   Slot — funde as props do wrapper NO filho (padrão asChild), sem
   dependência externa. Usado por Button asChild p/ virar <a>/<Link>
   mantendo o visual .vyd-btn.
   ===================================================================== */

type AnyProps = HTMLAttributes<HTMLElement> & { ref?: Ref<unknown>; [k: string]: unknown };

export function Slot({ children, ...slotProps }: AnyProps & { children: ReactNode }) {
  if (!isValidElement(children)) return null;
  const child = children as ReactElement<AnyProps>;
  const childProps = child.props;

  const merged: AnyProps = { ...slotProps, ...childProps };
  // className: soma; handlers: compõe (filho depois do wrapper); style: mescla
  merged.className = cx(slotProps.className as string, childProps.className as string);
  if (slotProps.style || childProps.style) {
    merged.style = { ...(slotProps.style as object), ...(childProps.style as object) };
  }
  for (const key of Object.keys(slotProps)) {
    const a = (slotProps as Record<string, unknown>)[key];
    const b = (childProps as Record<string, unknown>)[key];
    if (typeof a === 'function' && typeof b === 'function') {
      (merged as Record<string, unknown>)[key] = (...args: unknown[]) => {
        (a as (...x: unknown[]) => void)(...args);
        (b as (...x: unknown[]) => void)(...args);
      };
    }
  }
  return cloneElement(child, merged);
}
