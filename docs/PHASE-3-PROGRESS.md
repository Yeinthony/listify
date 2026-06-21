# Fase 3 - Listas de compras (+ optimizador + colaboradores)

> **Objetivo:** Construir el recurso **shopping-lists de cero**: capa de datos (tipos del contrato real + `api/*` + hooks TanStack Query) y **UI completa** (lista de listas, crear, detalle con items, optimizador y colaboradores), integrado al flujo existente (botón "Agregar" del `ProductCard`/`product-details`). Server state vía TanStack Query (ADR-0002, no Zustand).
> DoD: tipos alineados al contrato (camelCase, `myRole`, `itemCount`, `Paginated`), `api/shoppingLists.api.ts` en rutas relativas, hooks `useQuery`/`useMutation` con invalidación, pantallas funcionando (CRUD lista, items, optimizador, colaboradores), `npx tsc --noEmit` sin errores nuevos.

## Estado actual

**FASE 3 CERRADA (pendiente verificación en runtime contra backend).** Recurso `shopping-lists` completo: capa de datos + UI (listas, detalle/items, optimizador, colaboradores) + integración "Agregar a lista".

- Bloques: A/B/C/D/E/F/G/H — **8/8 hechos**.
- `tsc --noEmit`: **0 errores nuevos** (baseline 8 pre-existentes gluestack/Snackbar).
- Verificación en runtime pendiente de correr la app.

**Siguiente:** Fase 4 — Ubicaciones paginadas, pagos/descuentos, alertas, cotizaciones, push (FCM).

---

## Decisiones (aprobadas)

| # | Resolución | Motivación |
|---|------------|------------|
| A | **Datos + UI completa** | El usuario pidió la feature entera, no solo capa de datos. |
| B | **Colaboradores incluidos** en esta fase | Decisión de alcance del usuario. |
| C | **Server state vía TanStack Query** (no Zustand) | ADR-0002; coherente con Fase 2. |
| D | **Crear lista en modal**; **detalle/optimizador/colaboradores en pantallas** del Stack | Coherente con el patrón modal + Stack del repo. |
| E | **Listas paginadas: página 1 + refresh** (sin scroll infinito) | Acotar alcance; el usuario tiene pocas listas. |

---

## Contrato real del backend (base `/shopping-lists`, sin prefijo)

Verificado en `../listify-backend/src/modules/shopping-lists`. Roles: `reader | editor | owner`.

- `POST /shopping-lists` `{name, description?, isPublic?}` → `ShoppingList & {myRole:'owner'}`
- `GET /shopping-lists?page&pageSize` → `Paginated<ListSummary>` (lista + `owner{id,email,username}` + `myRole` + `itemCount`)
- `GET /shopping-lists/:id` → `ListDetail` (lista + `owner` + `items[]{...,product}` + `collaborators[]{...,user}` + `myRole`)
- `POST /shopping-lists/:id/optimize` (200) `OptimizeListDto` → `OptimizeResult`
- `PATCH /shopping-lists/:id` (owner) `{name?,description?,isPublic?}`
- `DELETE /shopping-lists/:id` (owner)
- `POST /shopping-lists/:id/items` (editor) `{productId, quantity?, notes?}` → `ListItem & {product}` (409 si ya existe)
- `PATCH /shopping-lists/:id/items/:itemId` (editor) `{quantity?, notes?}`
- `DELETE /shopping-lists/:id/items/:itemId` (editor)
- `GET /shopping-lists/:id/collaborators` (reader)
- `POST /shopping-lists/:id/collaborators` (owner) `{email, role}`
- `PATCH /shopping-lists/:id/collaborators/:collabId` (owner) `{role}`
- `DELETE /shopping-lists/:id/collaborators/:collabId` (owner)
- `POST /shopping-lists/:id/leave` (reader)

`OptimizeListDto`: `{lat, lng, km, maxStores?=1, channel?='minorista', applyDiscounts?=true, currency?='ars', exchangeType?}`.
`currency`: `ars|all|usd`; `exchangeType`: `blue|oficial|mep|ccl`. `OptimizeResult` con precios `number` (ver `optimizer/optimize-basket.ts`).
`totalEst` (Decimal) serializa como `string | null`.

---

## Pasos (bloques)

- [x] **A** capa de datos: tipos (`types/shopping-lists.d.ts`, `api/types/shopping-lists.d.ts`), `api/shoppingLists.api.ts`, `shoppingListKeys`, schemas Zod. Commits `90321bc`, `82621de`.
- [x] **B** hooks TanStack Query: `useLists`, `useListDetail`, `useListOptimizer`, `useListCollaborators`. Commit `72a7877`.
- [x] **C** UI listas: `ListCard`, tab `lists.tsx` (FlatList + refresh + empty + crear/eliminar), `CreateListModal` + `useCreateListForm`. Commit `d6d2fc4`.
- [x] **D** UI detalle: `list-detail.tsx`, `ListItemCard`, `UpdateItemModal` (editar/quitar). Commit `bdf87ca`.
- [x] **E** optimizador: `list-optimizer.tsx` (radio/maxStores + resultado). Commit `3957e8b`.
- [x] **F** colaboradores: `list-collaborators.tsx` + `useInviteCollaboratorForm` (invitar/rol/quitar/salir, gated por `myRole`). Commit `8f06a6d`.
- [x] **G** integración: `AddToListModal` + cableado "Agregar" en `ProductCard`/`product-details`. Commit `17a3a9b`.
- [x] **H** i18n (es/en) + cierre. Commits `92f5818`, `<cierre>`.

> Nota: las pantallas detalle/optimizador/colaboradores se registraron en `app/main/_layout.tsx` (typedRoutes). El "agregar items" desde el detalle se resuelve con el flujo `AddToListModal` desde productos (no hay buscador de productos dentro del detalle).

---

## DoD (Fase 3)

- Capa de datos completa (tipos del contrato, `api/shoppingLists.api.ts`, `shoppingListKeys`, schemas Zod).
- Hooks `useQuery`/`useMutation` con invalidación correcta (`list`/`detail`/`collaborators`).
- UI: CRUD de listas, items, optimizador y colaboradores funcionando; acciones gated por `myRole`.
- Integración "Agregar a lista" desde productos.
- `npx tsc --noEmit` sin errores nuevos (baseline 8).

---

## Notas / deuda

- Scroll infinito / paginación avanzada de listas (se hace página 1 + refresh).
- Listas públicas (`isPublic`) como feature de descubrimiento: fuera de alcance.
- Pagos/descuentos, alertas, cotizaciones, push (Fase 4); Recetas (Fase 5, bloqueada).
- 8 errores `tsc` pre-existentes (gluestack/Snackbar); ESLint sin configurar.

---

## Skills aplicadas

- `native-data-fetching`, `typescript-advanced-types`, `zod`, `react-hook-form`, `building-native-ui` (imitando NativeWind+Gluestack del repo).

---

## Commits de la fase

```
90321bc docs(fase-3): plan de Listas de compras (datos + UI + colaboradores)
82621de feat(lists): capa de datos de shopping-lists (tipos, api, query keys, schemas)
72a7877 feat(lists): hooks TanStack Query (listas, detalle/items, optimizador, colaboradores)
d6d2fc4 feat(lists): tab de listas con crear y eliminar (ListCard + CreateListModal)
bdf87ca feat(lists): pantalla de detalle con items (editar/quitar)
3957e8b feat(lists): pantalla de optimizador de canasta
8f06a6d feat(lists): pantalla de colaboradores (invitar/rol/quitar/salir)
17a3a9b feat(lists): agregar producto a lista desde ProductCard y detalle (AddToListModal)
92f5818 feat(i18n): claves de listas/items/optimizador/colaboradores (es/en)
<cierre> docs(fase-3): cerrar Fase 3
```
