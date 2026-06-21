# CLAUDE.md

Instrucciones para Claude Code al trabajar en este repo (app móvil de Listify).

## Proyecto

**Listify** es una app de comparación de precios de supermercados (MVP Argentina, multi-país a futuro). Este repo es la **app móvil** (Expo / React Native). El backend vive en `../listify-backend` (NestJS).

Para el contexto de integración con el backend lee `docs/architecture/integration.md` y los ADRs en `docs/adr/`. No dupliques esa información aquí.

## Reglas de trabajo (importantes)

- **Responde siempre en español.**
- **Antes de iniciar cualquier tarea, revisa las skills disponibles** y usa las que apliquen (ej. `building-native-ui`, `native-data-fetching`, `composition-patterns`, `react-best-practices`, `react-hook-form`, `zod`, `typescript-advanced-types`, `architecture-designer`, `tdd`, `simplify`, `review`). Si ninguna aplica, decilo explícitamente.
- **No agregues comentarios en el código** salvo que yo lo pida explícitamente.
- **Siempre pregunta antes de hacer cambios.** No edites archivos sin confirmación previa, aunque la tarea parezca clara.
- **Commits pequeños.** Un commit = un cambio lógico. Nunca agrupes cambios no relacionados.
- **Convención de commits:** Conventional Commits con scope, en español (`feat(...)`, `fix(...)`, `docs(...)`, `style(...)`, `chore(...)`), igual que el backend. Docs/ADRs en commits `docs(...)` separados.
- No crees `README.md` ni documentación nueva a menos que te lo pida.
- **No confíes en hallazgos de subagentes/Explore como si fueran hechos**: verifica contra el código real (sobre todo contratos de API) antes de afirmar.

## Stack

- Expo SDK 54 + React Native 0.81 + Expo Router 6 (`typedRoutes`)
- React 19, TypeScript ~5.9
- **NativeWind 4** (Tailwind) + Gluestack UI para estilos/componentes
- **Zustand 5** (estado de sesión + UI), **axios** (HTTP), **react-hook-form 7 + Zod 4** (formularios)
- **TanStack Query** para estado de servidor (ver ADR-0002)
- i18next (es/en), expo-secure-store, expo-location, expo-camera, expo-maps
- Gestor de paquetes: **npm** (`npx expo ...`)

## Comandos frecuentes

```bash
npx expo start             # Dev server (Metro)
npx expo start --android   # Abrir en Android
npx expo start --ios       # Abrir en iOS
npm test                   # Tests (jest-expo, watch)
npx tsc --noEmit           # Type-check sin emitir
```

Para device físico: el backend debe ser accesible por IP de LAN y `EXPO_PUBLIC_API_URL` debe apuntar a esa IP (no `localhost`). Ver ADR-0006.

## Arquitectura: conceptos que debes respetar

Detalle completo en `docs/architecture/integration.md` y `docs/adr/`. Lo esencial:

### Capa de datos
- **Un solo cliente HTTP** (`utils/httpClient.ts`, instancia `axios.create`) con `baseURL = EXPO_PUBLIC_API_URL`. Las funciones `api/*.ts` usan **rutas relativas**. (ADR-0001)
- **Sin prefijo `/api/v1`**: el backend NO aplica `setGlobalPrefix`; los recursos viven en `/auth`, `/products`, etc. (ADR-0006)
- **TanStack Query = estado de servidor** (caché/invalidación); **Zustand = sesión + UI**. No mezclar. (ADR-0002)
- **Tipos = contrato real del backend** (camelCase exacto) + genérico `Paginated<T>` para listados `{ data, meta }`. (ADR-0004)
- **Errores normalizados** a la clase `ApiError` en el interceptor de respuesta. (ADR-0005)

### Sesión y auth
- Backend con **sesiones opacas** (no JWT): `Authorization: Bearer <token>`. Token en `expo-secure-store` (`sessionToken`). Rehidratación con `whoami`; `401` → logout. (ADR-0003)

### Canal (channel)
- El backend distingue `minorista` / `mayorista` en endpoints de precios. Al consumir productos/precios, pasá `channel` cuando corresponda.

### Recetas
- El tab Recetas es **placeholder**: no existe módulo `recipes` en el backend. (ADR-0007 + `docs/architecture/recipes-module-spec.md`)

## Estructura del proyecto

```
app/                 # Rutas (Expo Router): (auth), main/(main) tabs, etc.
api/                 # Funciones de API por recurso (+ api/types)
components/          # UI, forms, modals (con sus hooks en hooks/)
store/               # Zustand (userStore, themeStore, snackbarStore, ...)
hooks/               # Hooks de pantalla
utils/               # interceptor/httpClient, i18n, formSchemes (Zod), ...
types/               # Tipos globales
docs/                # architecture/ + adr/
```

- Estilos con clases NativeWind (`className`). Componentes base de Gluestack UI.
- Formularios: react-hook-form + resolver Zod; los schemas viven en `utils/formSchemes.ts`.

## Testing

Estrategia completa en `docs/adr/0008-estrategia-testing.md` (espejo de la del backend, ADR-0013).

- **Unit** (mayoría): co-located `*.spec.ts(x)`, lógica pura (schemas Zod, `ApiError`, utils, funciones `api/*.ts` con `httpClient` mockeado). `npm test`
- **Component/hook**: `@testing-library/react-native` + QueryClient aislado + red mockeada (MSW o mock de `httpClient`).
- **E2E**: Maestro, pocos happy paths críticos (login, escanear EAN, crear lista).

**Reglas:** cobertura por riesgo (no por %); mockear **solo bordes externos** (HTTP, `expo-secure-store`, `expo-location`, `expo-camera`); nunca mockear la lógica propia ni TanStack Query. Tests no obligatorios antes de commit, pero corré los relevantes si tocás lógica P0/P1 (sesión/`ApiError`, schemas, `api/*.ts`).

## Archivos a NO tocar sin preguntar

- `.env`
- `app.json` (config Expo, keys de mapas, EAS project id)
- `docs/adr/*`
- `package.json` / lockfiles (al instalar deps, confirmá primero)

## Referencias

- `docs/architecture/integration.md` — arquitectura de la capa de datos, contrato, convenciones, roadmap
- `docs/architecture/recipes-module-spec.md` — spec del módulo Recetas pendiente
- `docs/adr/` — decisiones (ADR-0001 a ADR-0008)
- Backend: `../listify-backend` (`docs/ARCHITECTURE.md`, `docs/adr/`)
