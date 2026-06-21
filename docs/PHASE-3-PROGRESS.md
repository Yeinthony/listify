# Fase 3 - Listas de compras (+ optimizador + colaboradores)

> **Objetivo:** Construir el recurso **shopping-lists de cero**: capa de datos (tipos del contrato real + `api/*` + hooks TanStack Query) y **UI completa** (lista de listas, crear, detalle con items, optimizador y colaboradores), integrado al flujo existente (botón "Agregar" del `ProductCard`/`product-details`). Server state vía TanStack Query (ADR-0002, no Zustand).
> DoD: tipos alineados al contrato (camelCase, `myRole`, `itemCount`, `Paginated`), `api/shoppingLists.api.ts` en rutas relativas, hooks `useQuery`/`useMutation` con invalidación, pantallas funcionando (CRUD lista, items, optimizador, colaboradores), `npx tsc --noEmit` sin errores nuevos.

## Estado actual

**EN CURSO.** Fases 1–2 cerradas (capa de datos sobre TanStack Query). El tab Lists era placeholder; no existía capa de datos de listas.

- Bloques: A/B/C/D/E/F/G/H — 0 hechos.

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

- [ ] **A1** docs(fase-3): este doc + roadmap.
- [ ] **A2** feat(types): `types/shopping-lists.d.ts` + `api/types/shopping-lists.d.ts`.
- [ ] **A3** feat(api): `api/shoppingLists.api.ts` (~13 funciones).
- [ ] **A4** feat(query): `shoppingListKeys` en `api/queryKeys.ts`.
- [ ] **A5** feat(schemas): `createListScheme`/`addItemScheme`/`collaboratorScheme` en `utils/formSchemes.ts`.
- [ ] **B1** feat(query): `hooks/screens/useLists.ts`.
- [ ] **B2** feat(query): `hooks/screens/useListDetail.ts` (items + update/delete).
- [ ] **B3** feat(query): `hooks/screens/useListOptimizer.ts`.
- [ ] **B4** feat(query): `hooks/screens/useListCollaborators.ts`.
- [ ] **C1** feat(ui): `components/cards/ListCard.tsx`.
- [ ] **C2** feat(ui): tab `lists.tsx` (FlatList + refresh + empty + FAB).
- [ ] **C3** feat(ui): `CreateListModal` + `useCreateListForm`.
- [ ] **D1** feat(ui): registrar + `app/main/list-detail.tsx`.
- [ ] **D2** feat(ui): `components/cards/ListItemCard.tsx`.
- [ ] **D3** feat(ui): alta/edición/quitar item.
- [ ] **E1** feat(ui): UI optimizador.
- [ ] **F1** feat(ui): colaboradores (listar/invitar/rol/quitar/salir).
- [ ] **G1** feat(ui): `AddToListModal` + cablear "Agregar" de `ProductCard`/detalle.
- [ ] **H1** feat(i18n): claves es/en.
- [ ] **H2** docs(fase-3): tsc + cierre.

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
(pendiente)
```
