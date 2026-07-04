'use client';

import { createContext, useContext } from 'react';

/* =====================================================================
   FieldContext — wiring ARIA automático entre <Field> e os controles VYD.
   O Field publica id/aria-describedby/aria-invalid/aria-required; os
   controles (Input/Textarea/Select/...) consomem SEM sobrescrever props
   explícitas do usuário. Children não-VYD (opacos) não são tocados.
   ===================================================================== */

export type FieldCtx = {
  controlId: string;
  describedBy?: string;
  invalid?: boolean;
  required?: boolean;
} | null;

export const FieldContext = createContext<FieldCtx>(null);

/** Mescla as props do Field no controle — props explícitas do usuário vencem. */
export function useFieldControlProps<
  P extends { id?: string; 'aria-describedby'?: string; 'aria-invalid'?: unknown; 'aria-required'?: unknown; required?: boolean },
>(props: P): P {
  const ctx = useContext(FieldContext);
  if (!ctx) return props;
  return {
    id: ctx.controlId,
    'aria-describedby': ctx.describedBy,
    ...(ctx.invalid ? { 'aria-invalid': true } : null),
    ...(ctx.required ? { 'aria-required': true } : null),
    ...props, // explícito do usuário vence o contexto
  };
}
