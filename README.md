# dot-MVP-Front

Frontend Vue 3 para a plataforma de tutores personalizados.

## Decisões de Arquitetura

- **Vue 3 + Vite SPA** — um único app com rotas separadas para admin e embed iframe
- **Vue Router** — `/admin/*` para gestão, `/embed/:tutorId` para widget (sem chrome admin)
- **Pinia** — estado de autenticação JWT
- **Vitest** — testes unitários simples

> Este código foi produzido com auxílio de agentes de codificação (Cursor AI), conforme exigido pelo PRD.

## Como rodar

### Pré-requisitos
- Node.js 18+
- Backend rodando em `http://localhost:8000`

### Setup

```bash
cd dot-MVP-Front
npm install
cp .env.example .env
# Ajuste VITE_EMBED_API_KEY para o mesmo valor de EMBED_API_KEY do backend
```

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`

### Testes

```bash
npm test
```

### Build

```bash
npm run build
```

## Rotas

| Rota | Descrição |
|------|-----------|
| `/login` | Login admin |
| `/admin/tutors` | CRUD de tutores |
| `/docs/embed` | Documentação de incorporação |
| `/embed/:tutorId` | Widget de chat (para iframe) |

## Embed

```html
<iframe
  src="http://localhost:5173/embed/1"
  width="400"
  height="600"
  style="border: none;"
  title="Tutor Chat"
></iframe>
```

---

## Próximos Passos (para evolução do produto em produção)

- Gestão de usuários no painel admin
- Refresh token / sessão mais robusta
- Temas customizáveis por tutor no widget
