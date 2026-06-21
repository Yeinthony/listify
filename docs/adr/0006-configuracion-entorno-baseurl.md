# ADR-0006: Configuración de entorno y baseURL

## Status
Accepted

## Context

La app usa `EXPO_PUBLIC_API_URL` (variable pública de Expo, embebida en el bundle). Hoy vale `http://192.168.1.28:3000` y cada `*.api.ts` la concatena con el recurso. Verificado: el backend **no aplica `setGlobalPrefix`**, por lo que la base correcta es el host pelado (sin `/api/v1`). Para dispositivos físicos en desarrollo, el backend debe ser accesible por IP de LAN (no `localhost`).

## Decision

- `EXPO_PUBLIC_API_URL` = host del backend **sin prefijo** (ej. `http://<IP-LAN>:3000`).
- El `baseURL` del `httpClient` (ADR-0001) es exactamente `process.env.EXPO_PUBLIC_API_URL`; las rutas en `*.api.ts` son relativas.
- Mantener un `.env.example` documentando la variable y la nota de IP de LAN para device físico.
- Tipar `process.env` con `types/env.d.ts` (declarando `EXPO_PUBLIC_API_URL: string`) para autocompletado y chequeo, según la skill `native-data-fetching`.
- Si en el futuro el backend adopta `setGlobalPrefix`, el único cambio es el `baseURL` (o agregar el prefijo a la variable), sin tocar las `*.api.ts`.

> Nota: las variables `EXPO_PUBLIC_*` quedan embebidas en el binario; **no** poner secretos ahí.

## Alternatives Considered

**Incluir el prefijo `/api/v1` en la variable** — Rechazado hoy: el backend no monta ese prefijo; agregarlo daría 404.

**Configuración por `app.config` / build profiles (EAS)** — Considerado para staging/prod; se puede sumar después definiendo `EXPO_PUBLIC_API_URL` por perfil. Fuera de alcance de Fase 1.

## Consequences

### Positive
- Una variable simple, alineada con el runtime real del backend.
- Cambiar de entorno (dev/staging/prod) = cambiar una variable.

### Negative
- En device físico hay que recordar usar IP de LAN y misma red.

### Neutral
- Migrar a perfiles EAS no rompe esta decisión; solo cambia de dónde sale el valor.

## References
- `.env`, `.env.example`
- `listify-backend/src/main.ts`
