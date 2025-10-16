# Academia Frontend

Sistema completo de gerenciamento de academia integrado com backend Node.js + Prisma + PostgreSQL (Neon).

## Funcionalidades

### 🔐 Autenticação
- Login de alunos com JWT
- Proteção de rotas privadas
- Logout automático

### 📊 Dashboard
- Estatísticas gerais (total de alunos, treinos, matriculados, instrutores)
- Cards interativos com navegação

### 👥 Gerenciamento de Alunos
- Listagem com status de matrícula e saldo
- Cadastro de novos alunos
- Validação de senha forte no backend

### 🏋️ Treinos
- Criação de treinos vinculados a alunos e instrutores
- Sistema de destaque para treinos
- Exclusão lógica (soft delete)
- Listagem com detalhes completos

### 💪 Exercícios
- CRUD completo (criar, editar, deletar)
- Vinculação a treinos específicos
- Controle de séries e repetições

### 💰 Planos e Pagamentos
- Sistema de depósitos para adicionar saldo
- Registro de pagamentos (PIX, Cartão, Dinheiro)
- Histórico completo de transações
- Visualização de saldos dos alunos

## Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Estilização**: Tailwind CSS
- **Roteamento**: React Router DOM
- **HTTP Client**: Axios
- **Backend**: Node.js + Express + Prisma
- **Banco**: PostgreSQL (Neon)

## Como usar

1. **Backend**: Certifique-se que a API está rodando em `http://localhost:3000`

2. **Frontend**:
   ```bash
   npm install
   npm run dev
   ```

3. **Acesse**: http://localhost:5173

## Estrutura de Rotas

- `/login` - Autenticação
- `/` - Dashboard principal
- `/alunos` - Gerenciamento de alunos
- `/treinos` - Gerenciamento de treinos
- `/exercicios` - Gerenciamento de exercícios
- `/planos` - Pagamentos e depósitos

## Integração com Backend

O frontend consome as seguintes APIs:

- `POST /alunos/login` - Autenticação
- `GET/POST /alunos` - Gerenciamento de alunos
- `GET/POST /treinos` - Gerenciamento de treinos
- `GET/POST/PUT/DELETE /exercicios` - CRUD de exercícios
- `GET/POST /pagamentos` - Sistema de pagamentos
- `POST /depositos` - Depósitos de saldo
- `GET /dashboard/gerais` - Estatísticas do dashboard
- `GET /admins` - Lista de instrutores

## Recursos Implementados

✅ Autenticação JWT completa
✅ Dashboard com estatísticas reais
✅ CRUD completo de alunos, treinos e exercícios
✅ Sistema de pagamentos e depósitos
✅ Interface responsiva
✅ Validações de formulário
✅ Feedback visual de ações
✅ Navegação intuitiva
✅ Integração completa com backend

Sistema pronto para produção! 🚀