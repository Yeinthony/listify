# Fase 2 - Productos / Escaneo / Mapa (migración a TanStack Query)

> **Objetivo:** Migrar los hooks de productos/escaneo/mapa de fetching ad-hoc (`useEffect` + `useState`) a **TanStack Query** (`useQuery`), retirar código muerto (`brach-prices`) y tipar el `channel`. Sin pantallas nuevas y sin cambiar el cliente HTTP (axios se mantiene por ADR-0001).
> DoD: hooks de productos/escaneo/mapa sobre `useQuery` (caché/dedupe/invalidación), código muerto retirado, `channel` tipado (`Channel` + `DEFAULT_CHANNEL`), `npx tsc --noEmit` sin errores nuevos.

## Estado actual

**FASE 2 CERRADA (pendiente verificación en runtime contra backend).** Los 4 hooks de productos/escaneo/mapa migrados a TanStack Query, código muerto retirado y `channel` tipado.

- Pasos: 8/8 (código).
- `tsc --noEmit`: **0 errores nuevos** (siguen los 8 pre-existentes de gluestack/Snackbar).
- Verificación en runtime (escaneo, detalle, modales de tiendas/mapa) pendiente de correr la app.

**Siguiente:** Fase 3 — Listas de compras (+ optimizador).

---

## Decisiones (aprobadas)

| # | Resolución | Motivación |
|---|------------|------------|
| A | **`channel` como constante tipada por defecto** (`Channel = 'minorista' \| 'mayorista'`, `DEFAULT_CHANNEL = 'minorista'`) | No hay UI para alternar minorista/mayorista todavía; se deja la base tipada lista sin ampliar alcance. |
| B | **Mantener axios** (ADR-0001) | La skill `native-data-fetching` sugiere `expo/fetch`, pero el ADR-0001 manda axios. Solo se migra el patrón de fetching a TanStack Query. |
| C | **No implementar `GET /products/ean/:ean/prices`** | El endpoint real existe pero no se usa hoy; solo se retira el código muerto que apuntaba a `brach-prices` (endpoint inexistente). |

---

## Hallazgos

- `getPriceBranchByProduct` (`POST /products/brach-prices`) es **código muerto sin consumidores** (verificado por grep). Tipos asociados: `PriceBranchByProduct` (`types/products.d.ts`), `StoreByProductApiProps` (`api/types/products.d.ts`).
- `channel` está hardcodeado como string suelto `'minorista'` en `useStoreByProduct` y `useBranchsMapModal`.
- `console.log` de debug en la capa de datos (`useProductDetails`, `useBarcodeScan`, `useStoreByProduct`, `useBranchsMapModal`).
- `useBranchsMapModal` aplica el filtro de tiendas **al cerrar el menú** (no en cada toggle): hay que preservar esa UX al pasar a `useQuery` (estado `appliedStoresId` en la query key).
- `queryClient` ya define defaults (`staleTime` 5min, `gcTime` 30min, `retry` 2, `refetchOnWindowFocus` false).

---

## Pasos

- [x] **Paso 1 — Doc.** `docs/PHASE-2-PROGRESS.md` + cierre runtime de Fase 1 + roadmap. Commit `6980671`.
- [x] **Paso 2 — Retirar código muerto.** `getPriceBranchByProduct`, `PriceBranchByProduct`, `StoreByProductApiProps`. Commit `a35e8d8`.
- [x] **Paso 3 — Tipos.** `Channel`, `DEFAULT_CHANNEL`, query keys de products (`api/queryKeys.ts`). Commit `ba7105a`.
- [x] **Paso 4 — `useProductDetails`** → `useQuery`. Commit `05f8a28`.
- [x] **Paso 5 — `useBarcodeScan`** → `useQuery` (enabled por EAN). Commit `8b47285`.
- [x] **Paso 6 — `useStoreByProduct`** → `useQuery`. Commit `b3c6d81`.
- [x] **Paso 7 — `useBranchsMapModal`** (fetching) → `useQuery`. Commit `abdc2de`.
- [x] **Paso 8 — Cierre.** `tsc` (0 nuevos) + cierre del doc.

> Nota Paso 3: el `channel` hardcodeado (`'minorista'`) en `useStoreByProduct`/`useBranchsMapModal` se reemplazó por `DEFAULT_CHANNEL` en este paso (consecuencia directa de endurecer el tipo `Channel`), no en los pasos 6/7.

---

## DoD (Fase 2)

- Los 4 hooks (`useProductDetails`, `useBarcodeScan`, `useStoreByProduct`, `useBranchsMapModal`) usan `useQuery`; sin `useEffect`+`useState` para fetching ni `console.log` en esa capa.
- `getPriceBranchByProduct` / `brach-prices` / `PriceBranchByProduct` retirados (sin referencias).
- `channel` tipado (`Channel`, `DEFAULT_CHANNEL`); query keys namespaced por recurso.
- `npx tsc --noEmit` sin errores nuevos (baseline: 8 pre-existentes gluestack/Snackbar).

---

## Notas / deuda

- UI de selección minorista/mayorista: fuera de alcance (queda la constante tipada).
- `GET /products/ean/:ean/prices`: existe en el backend pero no se consume; no se implementa.
- 8 errores `tsc` pre-existentes (gluestack vendored + `Snackbar.tsx`).
- ESLint sin configurar (deuda de Fase 1).

---

## Skills aplicadas

- `native-data-fetching` — patrón TanStack Query (sin migrar a expo/fetch, ADR-0001).
- `typescript-advanced-types` — `Channel`, helper de query keys.
- `react-best-practices` — evitar refetch innecesario, memoización de derivados.

---

## Commits de la fase

```
6980671 docs(fase-2): plan de Productos/Escaneo/Mapa + cierre runtime Fase 1
a35e8d8 refactor(api): retirar código muerto brach-prices y tipos asociados
ba7105a feat(types): tipar Channel + DEFAULT_CHANNEL y query keys de products
05f8a28 feat(query): migrar useProductDetails a useQuery
8b47285 feat(query): migrar useBarcodeScan a useQuery (enabled por EAN escaneado)
b3c6d81 feat(query): migrar useStoreByProduct a useQuery
abdc2de feat(query): migrar fetching de useBranchsMapModal a useQuery
<cierre> docs(fase-2): cerrar Fase 2
```
