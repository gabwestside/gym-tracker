
# 💪 Gym Tracker

[![Next.js](https://img.shields.io/badge/Built%20with-Next.js-000?style=flat&logo=nextdotjs)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![Deploy Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=flat&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> Um sistema moderno e responsivo para registrar seus treinos de forma visual e motivadora.

---

## ✨ Visão Geral

O **Gym Tracker** é um aplicativo web feito com **Next.js 14**, **Supabase** e **Tailwind/Shadcn**, que permite aos usuários registrar, visualizar e acompanhar seus treinos com fotos, horários e observações.

Ideal para quem busca manter a disciplina e acompanhar sua jornada fitness de forma simples, visual e acessível. Pode ser usado individualmente ou em dupla.

---

## 📸 Preview
<img width="1317" height="933" alt="image" src="https://github.com/user-attachments/assets/d26e434d-1251-4b31-ac9b-4abc9a1ca292" />

---

## 🚀 Publicação

A aplicação está hospedada gratuitamente via GitHub Pages:  
👉 [Acesse aqui](https://gabweside-gym-tracker.vercel.app/)

---

## 🧩 Funcionalidades

- ✅ Autenticação segura com Supabase
- 🗓️ Registro de treinos com **data** e **hora**
- ✏️ Campos para anotações pessoais
- 📷 Upload de **fotos dos treinos** como motivação
- 📆 Calendário com histórico visual de treinos
- 🌙 Suporte a **dark mode**
- 📱 Layout **100% responsivo**
- 🔐 Modal de edição com visual moderno e animações
- 🧪 Toasts de feedback com Sonner

---

## 🛠️ Tecnologias

- [Next.js 14 (App Router)](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) (Auth + Database + Storage)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Day Picker](https://react-day-picker.js.org/)
- [Sonner (Toasts)](https://sonner.emilkowal.dev/)

---

## 🚀 Como rodar localmente

### 1. Clone o projeto

```bash
git clone https://github.com/seu-usuario/gym-tracker.git
cd gym-tracker
````

### 2. Instale as dependências

```bash
npm install
# ou
yarn
```

### 3. Configure o `.env.local`

Crie um arquivo `.env.local` com suas variáveis do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Rode o servidor

```bash
npm run dev
# ou
yarn dev
```

Abra `http://localhost:3000` no navegador 🚀

---

## 🧑‍💻 Como contribuir

1. Faça um fork deste repositório
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'feat: nova funcionalidade'`
4. Push para sua branch: `git push origin minha-feature`
5. Abra um pull request 🤝

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Desenvolvido por Gabriel Rodrigues

Se curtiu, me dá uma ⭐ no repositório e bora treinar! 💪🔥

