# Web Project API & Frontend

Projeto integrado do Sprint 18 (TripleTen): API Node.js/Express com MongoDB e front-end React (Vite) consumindo os mesmos endpoints. A aplicação já está implantada e acessível pelo domínio do servidor.

## Domínios
- **Frontend**: https://web-project-api-full.netlify.app/
- **Backend (API)**: https://web-project-api-full-loyl.onrender.com

## Tecnologias
- Backend: Node.js, Express 5, MongoDB (Mongoose), Celebrate/Joi, JWT, bcrypt, PM2, CORS.
- Frontend: React (Vite), consumo de API REST autenticada por Bearer token.

## Como rodar localmente
1. Clone o repositório e instale as dependências em cada pasta:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
2. Crie um arquivo `.env` em `backend/` com pelo menos:
   - `DB_PASSWORD=<senha_do_usuario_mongodb>`
   - `JWT_SECRET=<chave_secreta_para_tokens>`
   - (Opcional) `PORT=<porta>` se quiser substituir a padrão 3000.
3. Inicie a API: `cd backend && npm run dev` (ou `npm start`).
4. Inicie o front: `cd frontend && npm run dev` e acesse o endereço indicado pelo Vite.

## Rotas principais do backend
- `POST /signup` — cria usuário (email/senha).
- `POST /signin` — autentica e retorna JWT.
- `GET /users/me` — dados do usuário logado.
- `PATCH /users/me` — atualiza nome/sobre.
- `PATCH /users/me/avatar` — atualiza avatar.
- `GET /cards` — lista cards.
- `POST /cards` — cria card.
- `DELETE /cards/:cardId` — remove card (apenas dono).
- `PUT /cards/:cardId/likes` / `DELETE /cards/:cardId/likes` — like/unlike.
- `GET /crash-test` — rota de teste para provocar crash do servidor (para uso com PM2).

## Observações
- O front já consome a API pelo domínio do backend acima; ajuste as variáveis se o domínio mudar.
- Logs de requisições/erros são gravados em `backend/logs/` (ignorado pelo Git).

## Autor
- Marcelo Araujo Marangoni
