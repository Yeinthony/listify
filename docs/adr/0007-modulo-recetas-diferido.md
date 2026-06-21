# ADR-0007: Módulo Recetas diferido

## Status
Accepted (bloqueado por backend)

## Context

La app tiene un tab "Recetas" (`app/main/(main)/recipes.tsx`) en la navegación, pero el backend **no tiene módulo `recipes`** (no existe controller/servicio/tabla). No hay contrato contra el cual integrar.

## Decision

- Mantener la pantalla de Recetas como **placeholder** (sin llamadas a API) durante la integración actual.
- **No** eliminar el tab: se conserva la intención de producto y la navegación.
- Documentar los requisitos del futuro módulo en [`../architecture/recipes-module-spec.md`](../architecture/recipes-module-spec.md) y abrir un issue en el backend.
- La integración real (Fase 5) queda **bloqueada** hasta que el backend exponga el módulo.

## Alternatives Considered

**Eliminar/ocultar el tab** — Rechazado: se perdería la señal de producto; reintroducirlo después cuesta más.

**Implementar recetas solo en el cliente (datos locales)** — Rechazado: duplicaría lógica que pertenece al backend (datos compartidos, vinculación con productos/listas).

## Consequences

### Positive
- No se introduce código muerto que apunte a endpoints inexistentes.
- Requisitos quedan documentados para el equipo de backend.

### Negative
- El tab no es funcional hasta Fase 5 (UX de "próximamente").

### Neutral
- Cuando exista el backend, se sigue el patrón de las demás features (`api/recipes.api.ts` + tipos + hooks TanStack Query).

## References
- `app/main/(main)/recipes.tsx`
- `docs/architecture/recipes-module-spec.md`
