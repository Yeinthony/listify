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

## Mejoras posteriores al cierre

Iteraciones (UI + features nuevas) tras probar en runtime. El feature mayor (precios por sucursal)
está documentado aparte en [`docs/architecture/list-branch-prices.md`](./architecture/list-branch-prices.md).

### 1. Agregar productos al detalle por escaneo
- Botón flotante **"Agregar productos"** (gated `editor`/`owner`) → `BarcodeScanModal` con `targetListId`:
  alta **directa** a esa lista, el escáner queda abierto para sumar varios y maneja `409`. La app no
  tiene buscador de productos, así que el escáner es el mecanismo de alta.
- Hook compartido `hooks/screens/useAddToList.ts` (mutación + invalidación `detail`/`list` + snackbar
  `itemAdded` + `409`), reusado en `AddToListModal` y `ProductCard` (retrocompatible con el escáner del tab).
- i18n `addProducts`. Commits `ada52d8`, `70bc8dc`, `5210f7d`, `df433e1`, `ce6418f`.

### 2. Alta por escaneo: cantidad + flujo unificado
- Al tocar "Agregar" se pide **cantidad** (`QuantityPickerModal`); tras agregar, la tarjeta del escaneo
  **desaparece** (`useBarcodeScan.resetScan`). `useAddToList` soporta `quantity`.
- **Flujo unificado** dentro y fuera del detalle: `AddToListModal` pasó a ser **selector de lista**
  (`onSelect`), y `ProductCard`/`product-details` orquestan elegir lista → cantidad → alta.
- Rediseño de la tarjeta del producto escaneado (manteniendo rango mín/prom/máx) y del actionsheet de
  selección de lista (filas con ícono, cantidad y badge de rol).
- Commits `ae2fd99`, `c98f8c8`, `e966459`, `b6e0992`, `467f276`, `89a7a20`.

### 3. Precios en el detalle de lista (referencia)
- `hooks/screens/useListItemPrices.ts`: precio de referencia por producto vía `ean-light` (`useQueries`,
  cache compartido con el escáner) → **precio por producto + total estimado**.
- Card de **Total estimado** resaltada (tinte primario + ícono) y **tappable → precios por sucursal**.
- Varias iteraciones de diseño de `ListItemCard` (miniatura del producto, distribución, cantidad junto
  al precio resaltada). Commits `689291f`, `446adb1`, `b6065f4`, `f89bd6c`, `6121e69`, `d9d1f3d`,
  `f39403b`, `4890e8c`, `1e06fe8`, `7bdec5a`, `0f75fb7`.

### 4. Modal de cantidad (editar item)
- Editar item solo cambia la **cantidad** (sin notas), botones centrados, ícono **±** en la card,
  título "Modificar cantidad", layout equilibrado. Commits `b8e220d`, `266d297`, `4c8ae54`, `702f6bf`, `06284c5`.

### 5. Precios por sucursal (branch-prices) — feature nuevo
Consume `POST /shopping-lists/:id/branch-prices` (backend). Detalle en `docs/architecture/list-branch-prices.md`.
- Capa de datos: tipos (`BranchPriceEntry`/`ListBranchPrices`), `getListBranchPrices`,
  `shoppingListKeys.branchPrices`, `useListBranchPrices` (ubicación + query por `km`).
- Pantalla `app/main/list-branch-prices.tsx`: mapa (`expo-maps`) + ubicación + radio; **selects**
  (comercio + distancia en una línea, luego sucursal) en vez de carrusel; `BranchPriceDetailModal`
  (precio por producto + total + descuento + no disponibles).
- **Filtro por comercio**, selección por **tap en el marker**, **sucursal más barata** destacada (card
  verde + ⭐, opción del dropdown y marker con `favorite-pin.png` + `tintColor`), **zoom según km**,
  items de los selects centrados con nombre + distancia/precio siempre visibles.
- **Overlay de carga por fases** (`components/generals/MapLoadingOverlay.tsx`): ubicando → buscando
  comercios/precios (mensajes que ciclan) → renderizando, con cross-fade y fade-out al revelar el mapa.
- Commits `b0f9443`, `24de4a3`, `7bbd005`, `a0e8aed`, `ed8f5e7`, `c07cc4e`, `dd906e3`, `32e560d`,
  `9b7005f`, `b9929d3`, `492d99a`, `a366ff6`, `fafc70a`.

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
94c0131 docs(fase-3): cerrar Fase 3

# Mejoras posteriores al cierre
ada52d8 refactor(lists): extraer useAddToList y usarlo en AddToListModal
70bc8dc feat(lists): agregar productos por escaneo directo desde el detalle de la lista
5210f7d feat(i18n): clave addProducts (es/en)
df433e1 style(lists): botón "Agregar productos" flotante abajo al centro
ce6418f docs(fase-3): documentar agregar productos directo desde el detalle
ae2fd99 style(scan): rediseñar tarjeta de producto escaneado (mantener rango de precios)
c98f8c8 feat(lists): soportar cantidad en useAddToList
e966459 feat(scan): elegir cantidad al agregar y ocultar la tarjeta tras agregar
b6e0992 feat(i18n): clave quantityTitle (es/en)
467f276 refactor(scan): unificar alta por escaneo (elegir lista + cantidad) dentro y fuera del detalle
89a7a20 style(lists): rediseñar actionsheet de selección de lista
689291f feat(lists): hook useListItemPrices (precio de referencia por item)
446adb1 feat(lists): mostrar precio por producto y total estimado en el detalle
b6065f4 feat(i18n): claves de precios de lista (es/en)
f89bd6c style(lists): resaltar card de total estimado
6121e69 style(lists): quitar box-shadow de la card de total estimado
d9d1f3d style(lists): rediseñar card de producto en el detalle de lista
f39403b style(lists): cantidad junto al precio en la card (sin chip)
4890e8c style(lists): mantener distribución del rediseño sin chip (cantidad junto al precio)
1e06fe8 style(lists): miniatura del producto en la card del detalle
7bdec5a style(lists): redistribuir card de producto del detalle (acciones arriba, subtotal abajo)
0f75fb7 style(lists): ajustar miniatura y cantidad inline en la card del detalle
5d73aa7 style(lists): resaltar la cantidad en la card del detalle
b8e220d style(lists): editar item solo modifica cantidad y centra botones
266d297 style(lists): modal de cantidad equilibrado y editar tocando la cantidad (sin lápiz)
4c8ae54 style(lists): ícono ± para editar cantidad en la card del detalle
702f6bf style(lists): quitar info del producto del modal de cantidad
06284c5 style(lists): separar el título del modal de cantidad (mb-4)
b0f9443 docs(arquitectura): documentar branch-prices (contrato + integración mobile)
24de4a3 feat(lists): capa de datos de precios por sucursal (tipos, api, query key, hook)
7bbd005 feat(lists): pantalla de precios por sucursal (mapa + carrusel + detalle)
a0e8aed docs(arquitectura): branch-prices UI mobile hecha
ed8f5e7 style(lists): selects en lugar de carrusel en precios por sucursal
c07cc4e feat(lists): filtro por comercio en precios por sucursal
dd906e3 style(lists): comercio y distancia en una línea sobre el select de sucursal
32e560d feat(lists): seleccionar sucursal al tocar su marker en el mapa
9b7005f feat(lists): overlay de carga por fases en precios por sucursal
b9929d3 style(lists): overlay de carga con cross-fade de mensajes y fade-out al revelar el mapa
492d99a feat(lists): destacar la sucursal más barata (card, dropdown y marker con pin)
a366ff6 feat(lists): ajustar el zoom del mapa según el radio en km
fafc70a style(lists): centrar items de los selects y mostrar nombre+distancia/precio en sucursal
```
