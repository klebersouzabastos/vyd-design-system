# Publicar o repositório (init + commit + GitHub)

O repositório ainda **não** tem git inicializado nem remote. Rode os comandos
abaixo **na sua máquina**, dentro de `C:\Github\vyd-design-system`.

> Antes: troque `<owner>` pelo seu usuário/org do GitHub em `package.json`
> (campo `repository.url`) e no `CHANGELOG.md` (links do rodapé).

## 1. Inicializar e fazer o commit inicial

```bash
cd C:\Github\vyd-design-system

git init
git branch -M main
git add .
git commit -m "chore: VYD Design System v0.1.0 — token source, build pipeline, docs"
git tag v0.1.0
```

## 2. Criar o repositório remoto e dar push

Escolha **um** caminho.

### A) GitHub CLI (`gh`) — se você tiver instalado

```bash
# repositório PÚBLICO (sua escolha). Para privado: troque --public por --private
gh repo create vyd-design-system --public --source=. --remote=origin --push
git push origin v0.1.0
```

### B) Via web + git

1. Crie um repositório **vazio** chamado `vyd-design-system` em
   <https://github.com/new> — **Público**, sem README/.gitignore/license
   (já temos todos).
2. Conecte e suba:

```bash
git remote add origin https://github.com/<owner>/vyd-design-system.git
git push -u origin main
git push origin v0.1.0
```

## 3. (Opcional) Publicar no npm — só com sua autorização

O pacote está com `"private": true` como trava de segurança. Para publicar:

1. Remova `"private": true` do `package.json`.
2. `npm login` e confirme o escopo `@vyd` (precisa de org no npm).
3. `npm publish --access public`.

> Não publique sem necessidade. Apps podem consumir direto do GitHub:
> `npm install github:<owner>/vyd-design-system#v0.1.0`.
