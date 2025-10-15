# Academia Front (connected)

Este projeto Frontend (React + Vite + TypeScript + Tailwind) já vem configurado para consumir a sua API em `VITE_API_URL` (padrão: http://localhost:3000).

## Como usar

1. Extraia/clone esta pasta.
2. Copie `.env.example` → `.env` e ajuste `VITE_API_URL` se necessário.
3. No terminal, dentro da pasta do projeto:
   ```
   npm install
   npm run dev
   ```
4. Abra http://localhost:5173

Você precisa ter a API (academia-dev) rodando em `http://localhost:3000` (ou ajustar .env).

As páginas incluídas:
- Login (POST /login) — salva token em localStorage
- Dashboard
- Alunos (GET /alunos, POST /alunos)
- Instrutores (GET /instrutores, POST /instrutores)
- Treinos (GET /treinos, GET /treinos/:alunoId, POST /treinos)
- Exercícios (GET /exercicios, GET /exercicios/:id, POST /exercicios, PUT /exercicios/:id, DELETE /exercicios/:id)

Se quiser que eu adapte nomes de campos ou rotas, cole aqui um trecho do seu backend e eu ajusto.
