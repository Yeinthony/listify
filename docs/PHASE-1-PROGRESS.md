# Fase 1 - Fundación / Infra (capa de datos)

> **Objetivo:** Consolidar la base de la capa de datos de la app móvil y alinear el flujo de auth con el backend real, **sin agregar pantallas nuevas**. Cliente HTTP único (`httpClient`, ADR-0001), TanStack Query montado (ADR-0002), tipos alineados al contrato real + `Paginated<T>`/`ApiError` (ADR-0004/0005) y sesión Bearer/SecureStore con manejo de 401 (ADR-0003).
> DoD: `httpClient` con `baseURL`, `*.api.ts` en rutas relativas, `QueryClientProvider` montado, `npx tsc --noEmit` verde, flujo auth real (login/whoami/401).

## Estado actual

**FASE 1 CERRADA Y VERIFICADA EN RUNTIME.** Infra HTTP + tipos + TanStack Query + contrato de auth alineados. Sin pantallas nuevas. Flujo auth real (login/whoami/401) probado OK contra el backend.

- `tsc --noEmit`: **0 errores nuevos**. Quedan **8 errores pre-existentes** en componentes vendored de gluestack (`components/ui/bottomsheet`, `components/ui/table`) y `components/generals/Snackbar.tsx`, fuera de alcance de esta fase (deuda).
- Pasos: 6/6 (código). Verificación en runtime (login/whoami/401) **OK**.

**Siguiente:** Fase 2 — Productos / Escaneo / Mapa (migrar hooks a `useQuery`/`useMutation`, retirar `brach-prices`, alinear tipos de precios).

---

## Decisiones (aprobadas)

| # | Resolución | Motivación |
|---|------------|------------|
| A | **Mantener axios** (instancia dedicada), no migrar a expo/fetch | App ya construida sobre axios; el beneficio de fetch (streaming) no aplica. Análisis en ADR-0001. |
| B | **TanStack Query** para estado de servidor; Zustand solo sesión/UI | ADR-0002. En esta fase solo se monta el provider; no se migran pantallas. |
| C | **Sin prefijo `/api/v1`** en `baseURL` | El backend no aplica `setGlobalPrefix` (ADR-0006). |
| D | **`expiresAt`** se modela pero la expiración la dicta el backend vía 401 | No se chequea proactivamente en cliente por ahora. |

---

## Hallazgos

- Solo **3 archivos** importan `@/utils/interceptor`: `api/auth.api.ts`, `api/user.api.ts`, `api/products.api.ts` → migración acotada.
- `api/types/auth-api.d.ts` → `SigninResponse = { user, token }` (falta `expiresAt`). Login/whoami del backend devuelven `{ token, expiresAt, user }`.
- Drift de tipos en `types/users.d.ts`: `isVerifyed`→`isVerified`, `fullname`→`fullName`, `biography`→`bio`; falta `preferredExchangeRate`.
- `store/types/user-store.d.ts` usa `User` sin acceder a campos renombrados → blast radius chico.
- `utils/interceptor.ts`: muta el `axios` global, tiene `console.log` y el header typo `X-Requested-Width`. Reusar su helper `printMsg` para `ApiError`.
- `store/userStore.ts`: `logoutSession` borra el token con `setItemAsync('sessionToken','')` (mejor `deleteItemAsync`); `reloadSession` ya maneja 401.

---

## Pasos

- [x] **Paso 1 — Doc.** `docs/PHASE-1-PROGRESS.md`. Commit `74b55ef`.
- [x] **Paso 2 — Tipos base.** `api/types/common.d.ts` (`Paginated<T>`), `utils/apiError.ts` (clase `ApiError`, runtime → en `.ts`, no `.d.ts`), `types/env.d.ts`, corregir `types/users.d.ts`, `api/types/auth-api.d.ts` con `expiresAt`. Commit `bc3fc83`.
- [x] **Paso 3 — httpClient.** `utils/httpClient.ts` (axios.create + interceptors → `ApiError`, fix `X-Requested-With`, sin `console.log`); los 3 `*.api.ts` a rutas relativas; retirado `utils/interceptor.ts`. Commit `56f27db`.
- [x] **Paso 4 — TanStack Query.** `@tanstack/react-query` + `utils/queryClient.ts` + `QueryClientProvider` en `app/_layout.tsx`. Commit `01b122b`.
- [x] **Paso 5 — Auth/sesión.** `userStore`: 401 vía `ApiError`, `logout` con `deleteItemAsync`. (`auth.api.ts` ya quedó tipado en Paso 2/3.) Commit `1e5ce8b`.
- [x] **Paso 6 — Cierre.** `.env.example` + `tsc` (0 nuevos) + cierre del doc.

> Nota Paso 2: la clase `ApiError` lleva runtime, así que vive en `utils/apiError.ts` (no en un `.d.ts` ambiente como decía el plan).

---

## DoD (Fase 1)

- `httpClient` único con `baseURL`; los 3 `*.api.ts` en rutas relativas; sin `console.log` en capa HTTP; `X-Requested-With` corregido; `utils/interceptor.ts` retirado.
- `QueryClientProvider` montado (TanStack Query disponible) — sin migrar hooks de pantalla aún.
- Tipos alineados (`isVerified`/`fullName`/`bio`, `SigninResponse` con `expiresAt`, `Paginated<T>`, `ApiError`); `npx tsc --noEmit` verde.
- Flujo auth real contra el backend: login OK, `whoami` rehidrata, 401 → logout.

---

## Notas / deuda

- `expiresAt` no se chequea proactivamente (se confía en 401).
- `locationsByUserId` (paginado) y `getPriceBranchByProduct` (código muerto) se corrigen en Fase 2/4, no aquí.
- `.env.example` nuevo documentando `EXPO_PUBLIC_API_URL` (el `.env` real está gitignored).
- Migración de hooks de pantalla a `useQuery`/`useMutation`: Fases 2+.
- **Lint no configurado** en el repo móvil (no hay eslint config ni script). Verificación de tipos vía `tsc`. Configurar ESLint queda como deuda.
- **8 errores `tsc` pre-existentes** en componentes vendored de gluestack + `Snackbar.tsx` (no introducidos por Fase 1). Limpiarlos es deuda aparte.
- Verificación en runtime (login/whoami/401 contra backend real): **OK**.

---

## Skills aplicadas

- `native-data-fetching` — cliente HTTP, TanStack Query, `ApiError`.
- `typescript-advanced-types` — `Paginated<T>`, clase `ApiError`.

---

## Commits de la fase

```
74b55ef docs(fase-1): plan de Fundación (infra HTTP + auth)
bc3fc83 fix(types): alinear tipos al contrato del backend + Paginated/ApiError
56f27db feat(http): cliente axios centralizado con baseURL e interceptors (ApiError)
01b122b feat(query): integrar TanStack Query (provider + defaults)
1e5ce8b fix(auth): manejo de sesión con ApiError y logout con deleteItemAsync
<cierre> docs(fase-1): cerrar Fase 1
```
