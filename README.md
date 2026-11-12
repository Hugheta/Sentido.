# Sentido

**Sentido** é um jogo sensorial em primeira pessoa sobre acessibilidade urbana. A experiência convida o jogador a atravessar ambientes da cidade usando sons, orientação espacial e uma bengala virtual, refletindo sobre barreiras que pessoas com deficiência visual podem encontrar no espaço urbano.

O jogo propõe uma reflexão: uma cidade acessível precisa oferecer informações e caminhos que não dependam apenas da visão.

## Funcionalidades

- Navegação em primeira pessoa.
- Exploração de fases com obstáculos e pontos de referência.
- Recursos sonoros para orientar a exploração.
- Menu, instruções e pausa.
- Estrutura organizada para manutenção e expansão.

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

## Como executar

É necessário ter o [Node.js](https://nodejs.org/) instalado.

```bash
npm install
npm run dev
```

Abra no navegador o endereço mostrado pelo Vite, normalmente `http://localhost:5173`.

## Comandos

| Comando | Função |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Abre uma prévia da versão de produção |

## Estrutura do projeto

```text
sentido/
├── public/
│   └── images/              # Imagens públicas
├── src/
│   ├── components/          # Componentes da interface
│   │   └── game/            # Componentes da experiência de jogo
│   ├── game/                # Motor, fases e áudio
│   ├── utils/               # Funções auxiliares
│   ├── App.tsx              # Componente principal
│   ├── game.ts              # Cenas e lógica da demonstração
│   ├── index.css            # Estilos globais
│   ├── main.tsx             # Entrada do React
│   └── useSensoryAudio.ts   # Hook de áudio sensorial
├── tests/
│   └── manual-qa/           # Roteiros de teste com Playwright
├── index.html               # HTML e metadados
├── package.json             # Dependências e scripts
├── tsconfig.json            # Configuração TypeScript
└── vite.config.ts           # Configuração Vite
```

## Onde editar

- Menus, textos e telas: `src/components/`
- Elementos visuais da fase: `src/components/game/`
- Regras e movimentação: `src/game/engine.ts`
- Mapas e fases: `src/game/levels.ts`
- Sons: `src/game/audio.ts` e `src/useSensoryAudio.ts`
- Estilos: `src/index.css`
- Imagem de capa: `public/images/`

## Testes

Os roteiros de `tests/manual-qa/` usam Playwright e foram separados do código principal. Para executá-los, será necessário instalar o Playwright e o navegador Chromium. Confira a porta configurada no início de cada roteiro antes de rodar.

## Publicação

Para publicar o código, crie um repositório no GitHub e envie os arquivos deste projeto. Para hospedar o jogo, conecte o repositório a um serviço compatível com Vite, como Vercel ou Netlify, usando `npm run build` como comando de build e `dist` como diretório de saída.

## Status

Projeto em desenvolvimento.
