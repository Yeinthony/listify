# ADR-0007: Módulo Recetas diferido

## Status
Accepted (bloqueado por backend)

## Context

La app tiene un tab "Recetas" (`app/main/(main)/recipes.tsx`) en la navegación, pero el backend **no tiene módulo `recipes`** (no existe controller/servicio/tabla). No hay contrato contra el cual integrar.

El concepto del módulo (definido con el usuario) es: a partir de los productos y cantidades de la(s) **lista(s) de compras** (que actúan como inventario/stock), el usuario arma recetas **manualmente** y el sistema calcula **cuánto puede preparar** y el sobrante (caso meal-prep / armar menús). Es decir `lista(s) → receta` con cantidades **descontables**, **no** un recetario de pasos de cocina. Detalle en [`../architecture/recipes-module-spec.md`](../architecture/recipes-module-spec.md).

## Decision

- Mantener la pantalla de Recetas como **placeholder** (sin llamadas a API) durante la integración actual.
- **No** eliminar el tab: se conserva la intención de producto y la navegación.
- Documentar los requisitos del futuro módulo en [`../architecture/recipes-module-spec.md`](../architecture/recipes-module-spec.md) y abrir un issue en el backend.
- La integración real (Fase 5) queda **bloqueada** hasta que el backend exponga el módulo.

## Alternatives Considered

**Eliminar/ocultar el tab** — Rechazado: se perdería la señal de producto; reintroducirlo después cuesta más.

**Implementar recetas solo en el cliente (datos locales)** — Rechazado: el cálculo de factibilidad cruza las cantidades de `ListItem` (stock) con los items de la receta por `productId`; esos datos viven en el backend (`shopping-lists`, `products`). Persistir recetas y stock solo en el dispositivo duplicaría lógica y no sería consistente entre dispositivos.

**Recetario de pasos de cocina (receta → ingredientes → lista de compras)** — Descartado como concepto: no es lo que se busca. El flujo es el inverso (la lista existente es el insumo), orientado a meal-prep, no a seguir instrucciones de cocina.

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
