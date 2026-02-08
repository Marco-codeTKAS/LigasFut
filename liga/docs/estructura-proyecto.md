# Estructura base del proyecto (LigaFUT)

Este documento describe una propuesta inicial de **estructura de base de datos** y **estructura de archivos** para una liga de fútbol. La idea es partir de un MVP con módulos de administración (panel), calendario/partidos, resultados y tabla de posiciones.

## 1) Estructura de base de datos (relacional)

> Recomendado: PostgreSQL o MySQL.

### Tablas principales (MVP)

#### `users`
- `id` (PK)
- `full_name`
- `email` (unique)
- `password_hash`
- `role` (admin, delego, arbitro)
- `created_at`, `updated_at`

#### `leagues`
- `id` (PK)
- `name`
- `season_year`
- `status` (draft, active, finished)
- `created_at`, `updated_at`

#### `teams`
- `id` (PK)
- `league_id` (FK → leagues.id)
- `name`
- `logo_url` (nullable)
- `created_at`, `updated_at`

#### `players`
- `id` (PK)
- `team_id` (FK → teams.id)
- `full_name`
- `birth_date` (nullable)
- `position` (nullable)
- `number` (nullable)
- `created_at`, `updated_at`

#### `matches`
- `id` (PK)
- `league_id` (FK → leagues.id)
- `home_team_id` (FK → teams.id)
- `away_team_id` (FK → teams.id)
- `match_date`
- `round` (jornada)
- `venue` (nullable)
- `status` (scheduled, played, canceled)
- `created_at`, `updated_at`

#### `match_results`
- `id` (PK)
- `match_id` (FK → matches.id, unique)
- `home_score`
- `away_score`
- `notes` (nullable)
- `created_at`, `updated_at`

#### `standings`
- `id` (PK)
- `league_id` (FK → leagues.id)
- `team_id` (FK → teams.id)
- `played`
- `wins`
- `draws`
- `losses`
- `goals_for`
- `goals_against`
- `goal_difference`
- `points`
- `updated_at`

### Tablas complementarias (opcional)

#### `match_events`
Para tarjetas/goles si lo requieres más adelante.
- `id` (PK)
- `match_id` (FK → matches.id)
- `team_id` (FK → teams.id)
- `player_id` (FK → players.id, nullable)
- `event_type` (goal, yellow_card, red_card)
- `minute`

#### `team_staff`
Para entrenadores/auxiliares.
- `id` (PK)
- `team_id` (FK → teams.id)
- `full_name`
- `role`

### Reglas de negocio sugeridas
- Un `match_results` solo existe si el partido está en estado `played`.
- El `standings` se recalcula al registrar o actualizar un resultado.
- En `matches`, `home_team_id` y `away_team_id` no deben ser iguales.

## 2) Estructura de archivos (Quasar + Vue)

Propuesta para organizar el frontend en módulos:

```
src/
  assets/
  boot/
    api.ts                 # cliente axios / fetch configurado
  components/
    common/                # botones, cards, tablas reutilizables
  layouts/
    AdminLayout.vue
    PublicLayout.vue
  pages/
    admin/
      dashboard/
      leagues/
      teams/
      players/
      matches/
      results/
      standings/
    public/
      home/
      fixtures/
      standings/
  router/
    routes.ts
  stores/
    auth.ts
    leagues.ts
    teams.ts
    players.ts
    matches.ts
    standings.ts
  types/
    api.ts
    models.ts
  utils/
    standings.ts           # cálculos de tabla
```

### Convenciones recomendadas
- Separar **admin** y **public** dentro de `pages/`.
- Usar `stores/` (Pinia) por dominio.
- Centralizar tipos en `types/` para mantener consistencia con el backend.
- Mantener cálculos de tabla en `utils/standings.ts`.

## 3) Endpoints sugeridos (API)

```
GET    /api/leagues
POST   /api/leagues

GET    /api/teams
POST   /api/teams

GET    /api/players
POST   /api/players

GET    /api/matches
POST   /api/matches

POST   /api/matches/:id/result
GET    /api/standings
```

> Puedes implementar esta API con Node (Express o Nest) y desplegarla en el mismo servidor que Quasar.

## 4) Implementar API con Express en el mismo proyecto

Si quieres usar Express dentro del mismo repositorio, la forma más simple es crear un backend dentro de `liga/` como una carpeta separada (por ejemplo `server/`) y exponer el API para que el frontend lo consuma.

### Estructura sugerida

```
liga/
  server/
    src/
      index.ts
      routes/
        leagues.ts
        teams.ts
        players.ts
        matches.ts
        standings.ts
      controllers/
      services/
      db/
        connection.ts
      middlewares/
    package.json
```

### Dependencias mínimas

- `express`
- `cors`
- `dotenv`
- `pg` (PostgreSQL) o `mysql2` (MySQL)
- `zod` (validación de payloads)

### Flujo básico recomendado

1. **Crear `server/`** con su propio `package.json`.
2. **Levantar Express** en `/api` (ej. `http://localhost:3000/api`).
3. **Configurar CORS** para Quasar en desarrollo.
4. **Crear rutas por dominio** (`teams`, `players`, `matches`, etc.).
5. **Centralizar conexión a BD** en `db/connection.ts`.
6. **Añadir validación** en cada endpoint con `zod`.

### Ejemplo mínimo de `server/src/index.ts`

```ts
import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`API running on :${port}`);
});
```

### Integración con Quasar

- En `quasar.config.ts` configura el `devServer.proxy` para `/api` apuntando al backend.
- En producción puedes servir el build de Quasar con Nginx y hacer proxy a Express.

Si quieres, puedo generar una estructura inicial del backend con Express y los primeros endpoints (teams, players, matches) y una configuración de proxy para Quasar.
