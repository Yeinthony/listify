# ADR-0003: Sesión y token (Bearer opaco + SecureStore)

## Status
Accepted

## Context

El backend usa **sesiones en DB con tokens opacos** (no JWT), ver `listify-backend/docs/adr/0015`. El login devuelve `{ token, expiresAt, user }` y cada request autenticada envía `Authorization: Bearer <token>`. La app ya guarda el token en `expo-secure-store` (clave `sessionToken`) y rehidrata con `whoami`, pero la lógica está dispersa y `SigninResponse` ignora `expiresAt`.

## Decision

Formalizar el manejo de sesión en la app:
- **Almacenamiento:** token en `expo-secure-store` con clave `sessionToken`. (Opcional: persistir también `expiresAt` para detectar expiración local antes de pegarle al backend.)
- **Inyección:** el interceptor de request de `httpClient` agrega `Authorization: Bearer <token>` si existe (ADR-0001).
- **Rehidratación:** al iniciar la app, `reloadSession()` llama `GET /auth/whoami`; si responde OK, repuebla `userStore`.
- **Expiración / 401:** cualquier `401` (token inválido/expirado) limpia el token, resetea `userStore` y redirige a `/signin`.
- **Logout:** `POST /auth/logout` + borrar token + reset de `userStore`.
- **`userStore` (Zustand)** es la única fuente de verdad de la sesión en memoria.

## Alternatives Considered

**Migrar a JWT en el cliente** — Rechazado: el backend no emite JWT (ADR-0015 backend); no aplica.

**Guardar el token en AsyncStorage** — Rechazado: `expo-secure-store` ofrece almacenamiento cifrado, preferible para credenciales.

## Consequences

### Positive
- Flujo de sesión explícito y centralizado; un único punto para inyección y expiración.
- Alineado con el modelo de sesiones del backend (revocación inmediata, logout global).

### Negative
- `expo-secure-store` no está disponible en web; si se apunta a web habrá que un fallback (fuera de alcance actual, app es mobile-first).

### Neutral
- `expiresAt` se puede usar para UX (avisar expiración) pero la verdad la tiene el backend en cada request.

## References
- `listify-backend/docs/adr/0015-sessions-vs-jwt.md`
- `store/userStore.ts`, `api/auth.api.ts`
