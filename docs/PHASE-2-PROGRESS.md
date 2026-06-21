# Fase 2 - Productos / Escaneo / Mapa (migración a TanStack Query)

> **Objetivo:** Migrar los hooks de productos/escaneo/mapa de fetching ad-hoc (`useEffect` + `useState`) a **TanStack Query** (`useQuery`), retirar código muerto (`brach-prices`) y tipar el `channel`. Sin pantallas nuevas y sin cambiar el cliente HTTP (axios se mantiene por ADR-0001).
> DoD: hooks de productos/escaneo/mapa sobre `useQuery` (caché/dedupe/invalidación), código muerto retirado, `channel` tipado (`Channel` + `DEFAULT_CHANNEL`), `npx tsc --noEmit` sin errores nuevos.

## Estado actual

**EN CURSO.** Fase 1 cerrada y verificada en runtime (login/whoami/401 OK contra el backend).

- Pasos: 0/8.

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

- [ ] **Paso 1 — Doc.** `docs/PHASE-2-PROGRESS.md` + cierre runtime de Fase 1 + roadmap.
- [ ] **Paso 2 — Retirar código muerto.** `getPriceBranchByProduct`, `PriceBranchByProduct`, `StoreByProductApiProps`.
- [ ] **Paso 3 — Tipos.** `Channel`, `DEFAULT_CHANNEL`, query keys de products.
- [ ] **Paso 4 — `useProductDetails`** → `useQuery`.
- [ ] **Paso 5 — `useBarcodeScan`** → `useQuery` (enabled por EAN).
- [ ] **Paso 6 — `useStoreByProduct`** → `useQuery`.
- [ ] **Paso 7 — `useBranchsMapModal`** (fetching) → `useQuery`.
- [ ] **Paso 8 — Cierre.** `tsc` + cierre del doc.

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
(pendiente)
```
