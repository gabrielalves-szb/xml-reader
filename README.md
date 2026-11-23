<div align="center">

# 🔍 XML Reader

**Busca termos dentro de feeds XML remotos e devolve os trechos com contexto — sem baixar o arquivo.**

Cole a URL do feed, digite o que procura, receba até 10 ocorrências com 150 caracteres de contexto em volta e o termo destacado.

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

[**🔗 Acessar a ferramenta**](https://xml-reader-pi.vercel.app)

</div>

---

## 📖 Sobre o projeto

Feeds XML de e-commerce chegam facilmente a dezenas de megabytes. Quando você só precisa confirmar se um SKU está no feed, como um campo está escrito ou qual estrutura um produto usa, abrir o arquivo inteiro no navegador é lento — e às vezes travar a aba é o único resultado.

O **XML Reader** resolve o caso específico: passe a URL, passe o termo, receba só os pedaços relevantes.

A busca acontece **no servidor** (Route Handler do Next.js), então não há problema de CORS com feeds de terceiros e o XML nunca é carregado no navegador.

## ✨ Funcionalidades

- 🌐 **Busca em feed remoto** — informe qualquer URL pública de XML
- 🔤 **Case-insensitive** — não precisa acertar a caixa do termo
- 📄 **Trechos com contexto** — 150 caracteres antes e depois de cada ocorrência
- 🖍️ **Destaque visual** — o termo aparece marcado dentro do trecho
- 📋 **Copiar com um clique** — cada resultado tem botão de cópia com feedback
- 🔟 **Limite de 10 ocorrências** — o suficiente para conferência, rápido de ler
- ⚠️ **Erros claros** — status HTTP do feed, URL inválida e campos vazios têm mensagem própria

## 🛠️ Stack

| Tecnologia | Versão | Uso |
| ---------- | ------ | --- |
| [Next.js](https://nextjs.org/) | 16 | Framework React + Route Handler |
| [React](https://react.dev/) | 19 | Biblioteca de UI |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Tipagem estática |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Estilização utilitária |

Sem dependências de parsing de XML — a busca é textual, o que a torna tolerante a XML mal formado (justamente o caso em que você mais precisa dela).

## ⚙️ Como funciona

```
Navegador                    /api/search (servidor)              Feed remoto
   │                                 │                                │
   │  { xmlUrl, searchTerm }         │                                │
   ├────────────────────────────────►│                                │
   │                                 │  GET xmlUrl                    │
   │                                 ├───────────────────────────────►│
   │                                 │◄───────────────────────────────┤
   │                                 │  XML como texto                │
   │                                 │                                │
   │                                 │  indexOf em loop,              │
   │                                 │  janela de ±150 chars,         │
   │                                 │  para em 10 matches            │
   │  { matches: string[] }          │                                │
   │◄────────────────────────────────┤                                │
```

## 🚀 Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm, yarn, pnpm ou bun

### Instalação e execução

```bash
git clone https://github.com/Jlvieira0909/xml-reader.git
cd xml-reader
npm install

npm run dev      # desenvolvimento
npm run build    # build de produção
npm run start    # servir o build
npm run lint     # ESLint
```

Abra [http://localhost:3000](http://localhost:3000).

## 📁 Estrutura

```
xml-reader/
├── app/
│   ├── api/search/route.ts   # busca no servidor (POST)
│   ├── page.tsx              # interface
│   ├── layout.tsx
│   └── globals.css
├── next.config.ts
└── tsconfig.json
```

## 🔌 API

A rota também pode ser usada direto:

```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"xmlUrl":"https://exemplo.com/feed.xml","searchTerm":"SKU-1234"}'
```

**Resposta**

```json
{ "matches": ["...<g:id>SKU-1234</g:id><g:title>Camiseta..."] }
```

**Erros** — `400` com `{ "error": "..." }` para campos ausentes, feed inacessível ou falha de rede.

## 🌐 Deploy

Hospedado na [Vercel](https://vercel.com/): **[xml-reader-pi.vercel.app](https://xml-reader-pi.vercel.app)**

---
