# Brief do Claude Design (preservado)

Texto usado para gerar o painel de identidade no `claude.ai/design`. Mantido aqui
como referência histórica (antes vivia no `README.md`).

> Crie um **painel de identidade visual (brand & UI style guide)** para o
> ecossistema de software "VYD" — um conjunto de ferramentas profissionais que
> assessoram empresas de engenharia (gestão de obras, gestão de pessoas, geração
> automatizada de documentos de engenharia, BIM).
>
> **Personalidade:** técnico, sóbrio, confiável, denso — como um instrumento
> profissional / cockpit de software de engenharia. NÃO deve parecer um SaaS de
> startup nem ter "cara de IA". Evite explicitamente: roxo/gradientes violeta,
> glassmorphism, blur difuso, cantos muito arredondados, espaçamento arejado de
> landing page, ícones genéricos soltos.
>
> **Paleta (use exatamente estes valores):**
> - Marca (azul-blueprint): primária #1E5FC4; tons #6B9CE0, #143F86, #0B2245.
> - Neutros grafite: chrome #0D1117, painel #161B22, canvas #1F2630,
>   bordas #3A4350, texto secundário #7B8794, texto primário #E1E6EB.
> - Feedback: sucesso #2E9E6B, alerta #D9920A (âmbar de obra, só alertas),
>   erro #D24545.
>
> **Tipografia:** UI em "Inter Tight" (compacta, técnica); dados numéricos,
> cotas e IDs em "JetBrains Mono" com algarismos tabulares. Escala compacta,
> corpo base 13px. Alinhamento à esquerda, denso.
>
> **Formas:** raio de canto contido (3–5px, máx 8px em containers grandes).
> Hierarquia por linha fina (1px) e densidade, não por sombra. Sombras mínimas
> e duras. Item ativo sinalizado por barra de acento azul (2px), padrão Autodesk.
>
> **Entregue, num único documento de identidade:**
> 1. Logo: monograma "VYD" + um símbolo geométrico simples (referência a
>    blueprint/engenharia — ex. malha, esquadro, módulo), em versões positiva e
>    negativa.
> 2. Paleta completa com os hex acima, em swatches rotulados.
> 3. Escala tipográfica (display → caption) com os dois tipos.
> 4. Grid de espaçamento (base 4px) e raios.
> 5. Amostra de componentes no estilo: botão primário, botão fantasma, input,
>    card/painel, e UM item de ribbon nos estados normal/hover/ativo.
> 6. Uma faixa mostrando o "app shell" invariante (ribbon-only, coluna única): top bar
>    (logo + switcher de ferramenta), ribbon-tabs, ribbon de comandos, canvas em
>    largura cheia, status bar. SEM menu lateral esquerdo e SEM painéis laterais.
>
> Mostre tudo em tema escuro (chrome do app). Layout do guia: denso, organizado
> em seções com rótulos pequenos em caixa alta.

**Status:** guia gerado e revisado. Símbolo selecionado: cubo isométrico (ver
`docs/BRAND.md`). Próximo passo: exportar o SVG do logo e adicionar em `brand/`.
