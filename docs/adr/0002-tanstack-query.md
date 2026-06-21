# ADR-0002: TanStack Query para estado de servidor

## Status
Accepted

## Context

Hoy el fetching es ad-hoc dentro de hooks de pantalla (`useEffect` + `useState`) y el resultado se guarda a veces en Zustand. No hay caché, deduplicación de requests, reintentos ni invalidación. A medida que crezca la cobertura (productos, listas, descuentos, cotizaciones, alertas), este patrón genera código repetido y estados inconsistentes (p. ej. una lista que no se refresca tras agregar un ítem).

Necesitamos una capa de **estado de servidor** que gestione caché, ciclos loading/error, reintentos e invalidación, sin mezclarla con el estado de UI.

## Decision

Adoptar **`@tanstack/react-query`** como gestor de estado de servidor:
- `QueryClientProvider` en `app/_layout.tsx`, con un `QueryClient` configurado en `utils/queryClient.ts` (defaults de `retry`, `staleTime`, `gcTime`).
- Lecturas con `useQuery`; escrituras con `useMutation` + `invalidateQueries`.
- **Zustand queda exclusivamente** para sesión (`userStore`) y estado de UI (theme, snackbar, modales).
- Convención de **query keys** namespaced por recurso: `['product', ean, params]`, `['locations', { page }]`, `['shopping-lists']`, etc.

## Alternatives Considered

**SWR** — Considerado: API simple. Rechazado: TanStack Query tiene mejor soporte de mutaciones/invalidación y devtools, y es el estándar de facto en RN.

**Seguir con hooks + `useEffect`** — Rechazado: sin caché/dedupe/invalidación; más boilerplate y bugs de sincronización.

**Guardar todo en Zustand** — Rechazado: Zustand no resuelve caché por clave, expiración ni dedupe; mezclar estado de servidor y UI complica la lógica.

## Consequences

### Positive
- Caché, dedupe, reintentos e invalidación declarativa de fábrica.
- Menos boilerplate por pantalla; estados loading/error consistentes.
- Separación limpia servidor vs UI.

### Negative
- Nueva dependencia y curva de aprendizaje (query keys, invalidación).

### Neutral
- Los hooks de pantalla actuales se migran progresivamente (Fases 2+); coexisten con el patrón viejo durante la transición.

## References
- https://tanstack.com/query/latest
- Skill `native-data-fetching` del repo
