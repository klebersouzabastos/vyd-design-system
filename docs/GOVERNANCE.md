# VYD — Governança & depreciação

Como o VYD versiona, quebra (o mínimo possível) e aposenta coisas. A partir da
**v1.0.0** o sistema é estável e este documento é o contrato com os apps.

## SemVer — o que cada número significa aqui

O pacote segue [SemVer](https://semver.org/lang/pt-BR/). A "API pública" do VYD é:

1. **Nomes de variáveis `--vyd-*`** (o contrato do `build/verify.mjs`).
2. **Nomes de classes `.vyd-*`** e sua estrutura de markup.
3. **Chaves do preset Tailwind** e do objeto de tokens (`dist/tokens.*`).
4. **API dos componentes `vyd-react`** (nomes, props).
5. **Dimensões/estrutura do app shell** (`shell.css`).

| Bump | Quando | Exemplos |
|---|---|---|
| **PATCH** (`1.0.x`) | Correção sem mudar contrato nem aparência intencional. | Ajuste de bug em CSS, typo em doc, fix de tipo. |
| **MINOR** (`1.x.0`) | **Adição** retrocompatível. Nada renomeado/removido. | Novo token, novo componente, novo tema, nova prop opcional. |
| **MAJOR** (`x.0.0`) | Quebra: renomear/remover token/classe/prop, mudar valor que altera layout de forma incompatível, mudar estrutura do shell. | Remover um `--vyd-*`, renomear `.vyd-btn`, trocar assinatura de componente. |

> **Valores de token** (ex.: mudar um hex) são no mínimo MINOR e entram no CHANGELOG
> com destaque — apps podem depender da cor exata. Uma mudança de valor que altere
> contraste/legibilidade de forma perceptível é tratada como candidata a MAJOR.

Regra de ouro do `verify`: se ele acusar variável **faltando ou renomeada**, é
MAJOR. Se só acusar variável **nova**, é MINOR.

## Ciclo de depreciação

Nada é removido sem aviso. O caminho é sempre **deprecar → conviver → remover**:

1. **Deprecar (em um MINOR).** O item continua funcionando. Marca-se:
   - **Tokens:** comentário `_deprecated` no `tokens.json` com substituto e versão-alvo
     de remoção. O valor continua emitido.
   - **Classes CSS:** comentário `/* @deprecated desde X.Y — use .vyd-… */` acima da
     regra; a regra permanece.
   - **React:** JSDoc `@deprecated` na prop/componente (o TS avisa no editor).
   - Entrada em `CHANGELOG.md` → seção **Depreciado**.
2. **Conviver.** O item deprecado sobrevive por **pelo menos um MAJOR inteiro**
   (mínimo ~1 ciclo/❥ um major). Substituto e antigo coexistem.
3. **Remover (só em um MAJOR).** A remoção vira entrada **Removido** no CHANGELOG,
   com o mapa de migração (de→para). Idealmente acompanhada de um passo de codemod
   ou instrução de find/replace.

### Exemplo de anotação

```jsonc
// tokens.json
"radius": {
  "pill": { "value": "9999px", "_deprecated": "desde 1.3 — use radius.full; remoção em 2.0" }
}
```

```css
/* @deprecated desde 1.3 — use .vyd-tag. Remoção em 2.0. */
.vyd-chip { /* … */ }
```

```tsx
interface ButtonProps {
  /** @deprecated desde 1.3 — use `variant="primary"`. Remoção em 2.0. */
  primary?: boolean;
}
```

## Processo de mudança (PR)

Toda PR que toca a API pública:

1. Passa no gate (`npm test`: build + verify + typecheck) — ver [TESTING.md](TESTING.md).
2. Classifica o bump (PATCH/MINOR/MAJOR) na descrição.
3. Atualiza `CHANGELOG.md` (Keep a Changelog) na seção correta.
4. Se deprecou algo: anota no código **e** no CHANGELOG (Depreciado).
5. Se removeu algo: só em MAJOR, com mapa de migração.

O merge é **`--no-ff`** (preserva o histórico da fase/feature). A versão é fechada
com `npm version <patch|minor|major>` (que cria a tag) — ver [PUBLISH.md](PUBLISH.md).

## Suporte

- Suporte ativo: **último MAJOR**. Correções críticas podem ser backportadas para o
  MAJOR anterior por um período curto de transição.
- Apps devem **fixar a versão** (`"vyd-design-system": "1.x"`) e subir MAJOR de forma
  deliberada, lendo o CHANGELOG.

## Papéis

- **Owner do sistema (K2+/VYD):** aprova MAJOR e mudanças de valor de token.
- **Contribuidores:** abrem PR classificada; MINOR/PATCH fluem com o gate verde.

> Versionamento operacional e publicação no npm: [PUBLISH.md](PUBLISH.md).
> Histórico: [CHANGELOG.md](../CHANGELOG.md). Roadmap: [ROADMAP.md](ROADMAP.md).
