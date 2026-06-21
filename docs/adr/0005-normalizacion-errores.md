# ADR-0005: Normalización de errores de API

## Status
Accepted

## Context

El backend (NestJS) devuelve errores con la forma `{ statusCode, message, error }`, donde `message` puede ser `string` o `string[]` (cuando falla la validación de class-validator). El interceptor actual (`utils/interceptor.ts`) ya muestra un snackbar según el status y tiene un helper `printMsg` que aplana arrays/`errors`. Sin embargo, el error que se propaga a quien llama es el `AxiosError` crudo, por lo que cada hook/pantalla tiene que volver a interpretar la respuesta.

Con TanStack Query (ADR-0002), el `error` de `useQuery/useMutation` debería tener una forma estable y tipada.

## Decision

El interceptor de respuesta de `httpClient` **normaliza** todo error a un tipo estable y lo propaga. Se modela como **clase** (no interface) para poder discriminar con `instanceof`, siguiendo la guía de la skill `native-data-fetching`:

```ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,   // 0 si es error de red/timeout
    message: string,             // ya aplanado (arrays unidos)
    public error?: string,       // p. ej. "Unauthorized"
    public raw?: unknown,        // AxiosError original para depurar
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

Uso típico: `if (err instanceof ApiError && err.statusCode === 401) { ... }`.

- Reglas: error de red / timeout → `statusCode: 0` con mensaje amigable; en otro caso se toma `statusCode` y se aplana `message` (reusar la lógica de `printMsg`).
- El **snackbar global se mantiene** para feedback inmediato (red, 5xx, etc.), pero el `ApiError` se propaga (`Promise.reject(apiError)`) para que TanStack Query / hooks decidan UI específica.
- Casos que NO deben mostrar snackbar automático (p. ej. `401` esperado durante `whoami`) se manejan en el caller revisando `statusCode`.

## Alternatives Considered

**Dejar el `AxiosError` crudo** — Rechazado: obliga a cada caller a conocer la estructura de Axios y del backend.

**Solo snackbar, sin propagar** — Rechazado: impide UI contextual (errores inline en formularios, estados de error por query).

## Consequences

### Positive
- Forma de error única y tipada en toda la app; menos lógica duplicada.
- Compatible con TanStack Query (`error: ApiError`).

### Negative
- Hay que revisar los `catch` actuales que asumen `AxiosError`.

### Neutral
- El snackbar global sigue siendo el feedback por defecto; se puede silenciar por caso.

## References
- `utils/interceptor.ts` (helper `printMsg` actual)
- `listify-backend/src/common/filters/` (forma de error)
