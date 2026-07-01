# Publicar & versionar

O repositório já existe em
<https://github.com/klebersouzabastos/vyd-design-system> e está em **1.0.0**
(estável). Este doc é o processo de **cortar uma release** e, opcionalmente,
**publicar no npm**. Regras de versão/depreciação: [GOVERNANCE.md](GOVERNANCE.md).

## Tag & release — automáticos

`.github/workflows/release.yml` roda a cada push na `main`: lê a versão do
`package.json` e, se a tag `vX.Y.Z` ainda não existir, **cria a tag e a GitHub
Release** (com as notas extraídas do `CHANGELOG.md`). Roda no runner do GitHub, que
tem permissão de escrita — por isso funciona mesmo quando o ambiente de dev não
consegue dar `git push` de tags. É idempotente: tag existente = no-op.

Ou seja: para lançar, **basta subir o bump de versão para a `main`** (passo abaixo).
A tag aparece sozinha em segundos.

## Cortar uma release

1. Garanta o gate verde e o `dist/` regenerado:
   ```bash
   npm test          # build + verify + typecheck
   git diff --exit-code   # dist/ commitado bate com o build
   ```
2. Atualize `CHANGELOG.md` (seção da nova versão, formato Keep a Changelog).
3. Feche a versão — cria o commit de bump **e** a tag:
   ```bash
   npm version <patch|minor|major>   # ex.: minor → 1.1.0, cria tag v1.1.0
   ```
   Escolha o bump pela classificação em [GOVERNANCE.md](GOVERNANCE.md)
   (adição = minor; quebra = major; fix = patch).
4. Suba branch + tag e abra PR (merge `--no-ff` para preservar histórico):
   ```bash
   git push -u origin <branch>
   git push origin --tags
   ```

## Publicar no npm (opcional — só com autorização)

Desde a 1.0.0 o pacote **não** tem mais `"private": true`, então `npm publish`
funciona. Escopo `@vyd` exige uma org no npm.

```bash
npm login                         # conta com acesso à org @vyd
npm publish --access public       # respeita 'files' (dist, css, tokens, icons, build, brand, demo)
```

O que é publicado é controlado pelo allowlist `files` do `package.json` — `react/`,
`test/`, `.github/` e configs de dev **não** entram no tarball. Confira antes com:

```bash
npm pack --dry-run                # lista exatamente o que iria pro npm
```

> Alternativa sem npm: apps podem consumir direto do GitHub, fixando a tag:
> ```bash
> npm install github:klebersouzabastos/vyd-design-system#v1.0.0
> ```

## Checklist de release

- [ ] `npm test` verde (build + verify + typecheck).
- [ ] `git diff --exit-code` limpo (gerados commitados).
- [ ] `CHANGELOG.md` atualizado + links de rodapé.
- [ ] `npm version <bump>` (commit + tag).
- [ ] `README.md` badge de versão conferido.
- [ ] Push de branch **e** tag; PR com merge `--no-ff`.
- [ ] (Se publicar) `npm pack --dry-run` revisado → `npm publish --access public`.
