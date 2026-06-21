# ADR-0004: Contrato de tipos y envoltorio paginado

## Status
Accepted

## Context

Los tipos del cliente divergen del contrato real del backend:
- `types/users.d.ts`: `isVerifyed` (typo) vs backend `isVerified`; `Profile.fullname`/`biography` vs backend `fullName`/`bio`; falta `preferredExchangeRate`.
- `api/types/auth-api.d.ts`: `SigninResponse = { user, token }` ignora `expiresAt` (el backend devuelve `{ token, expiresAt, user }`).
- Los listados del backend usan un **envoltorio paginado** `{ data, meta }` (p. ej. `GET /users/list-locations`), pero la app asume arrays planos (`Location[]`).

Esto provoca campos `undefined` silenciosos y manejo incorrecto de respuestas paginadas.

## Decision

Los tipos del cliente son **derivados del contrato real del backend** (camelCase exacto):
- Corregir `types/users.d.ts`: `isVerified`, `Profile.fullName`, `Profile.bio`, agregar `preferredExchangeRate` (`'blue' | 'oficial' | 'mep' | 'ccl'`).
- `SigninResponse = { token: string; expiresAt: string; user: User }`.
- Definir un genérico reutilizable:

```ts
export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; pageSize: number; pages: number };
}
```

- Los endpoints de listado se tipan como `Paginated<T>` (p. ej. `Paginated<Location>`).
- Donde el backend convierte moneda, los precios pueden venir con campos extra (`*Usd`) y un bloque `exchangeRate`; se modelan al integrar productos (Fase 2).

## Alternatives Considered

**Generar tipos automáticamente (OpenAPI/Swagger)** — Rechazado por ahora: el backend no expone Swagger. Queda como mejora futura si se agrega.

**Mantener los tipos actuales y mapear en runtime** — Rechazado: oculta el contrato real y multiplica adaptadores.

## Consequences

### Positive
- El compilador atrapa desajustes; los datos del backend se leen con el nombre correcto.
- `Paginated<T>` unifica el manejo de listados.

### Negative
- Cambiar nombres de campos obliga a actualizar componentes/usos que leían los nombres viejos.

### Neutral
- Si el backend agrega Swagger, se puede migrar a tipos generados sin romper la convención.

## References
- `listify-backend/prisma/schema.prisma` (User, Profile)
- `listify-backend/src/common/dto/` (paginación)
