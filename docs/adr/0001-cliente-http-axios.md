# ADR-0001: Cliente HTTP con instancia Axios dedicada

## Status
Accepted

## Context

La capa `api/` usa el objeto global de Axios y le monta interceptores con `axios.interceptors.request.use(...)` en `utils/interceptor.ts`. Cada archivo `*.api.ts` arma la URL completa a mano con `` `${process.env.EXPO_PUBLIC_API_URL}/auth` ``, repitiendo el host en cada módulo.

Problemas:
- Mutar el Axios global acopla toda la app a esa configuración y dificulta tests/aislamiento.
- La `baseURL` está duplicada en cada `*.api.ts`; un cambio de host obliga a tocar varios archivos.
- Verificado: el backend NestJS **no** aplica `setGlobalPrefix` (ver `listify-backend/docs/adr/0011`), por lo que la base es el host pelado, sin `/api/v1`.

## Decision

Crear una **instancia dedicada** en `utils/httpClient.ts`:

```ts
const httpClient = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL });
httpClient.interceptors.request.use(...);   // Bearer + headers
httpClient.interceptors.response.use(...);  // normaliza error (ver ADR-0005)
export default httpClient;
```

Las funciones `*.api.ts` usan **rutas relativas** (`httpClient.get('/products/ean/' + ean)`) en lugar de URLs absolutas. `utils/interceptor.ts` se migra a `httpClient.ts` y se retira.

## Alternatives Considered

**Mantener el Axios global mutado** — Rechazado: acoplamiento global, baseURL duplicada, difícil de testear.

**`expo/fetch` (preferencia de la skill `native-data-fetching`)** — Evaluado en serio y **no elegido por ahora**.

La skill de networking del repo recomienda `expo/fetch` sobre axios. Motivos válidos del ecosistema Expo:
- En React Native axios corre sobre `XMLHttpRequest` (polyfill), mientras que `expo/fetch` es una implementación nativa (WinterCG) más cercana al stack de red real.
- `expo/fetch` soporta **streaming** de respuestas en nativo (SSE, descargas grandes, tokens de LLM); axios sobre XHR no.
- Sin dependencia extra (~13–50kb), estándar y portable (web / nativo / API routes), cancelación con `AbortController` de primera clase.

Por qué **no** lo adoptamos en este proyecto:
- El beneficio decisivo (streaming) **no aplica** a Listify: es una app de comparación de precios, sin SSE ni streaming de LLM.
- La app **ya** está construida sobre `axios@1.13` con interceptor + integración a snackbar; todo el código usa `AxiosResponse<T>` y `axios.isAxiosError`. Migrar es un refactor con riesgo a cambio de, esencialmente, ahorrar una dependencia.
- Con `fetch` habría que reimplementar a mano: interceptores (Bearer + `ApiError`), **throw en 4xx/5xx** (fetch no lanza en respuestas no-2xx), timeout (`AbortController` + `setTimeout`) y parseo JSON. Los interceptores de axios cubren ADR-0003/0005 con menos código.

**Cuándo reconsiderar:** si aparece necesidad de streaming/SSE, si se quiere unificar networking con web/API routes de Expo Router, o si se prioriza quitar la dependencia. La migración sería acotada gracias a que el cliente está centralizado (este mismo ADR): cambia `httpClient` y los `catch` que dependen de `AxiosError`.

**`fetch` nativo de RN + wrapper propio** — Rechazado por las mismas razones que `expo/fetch`, y además sin sus ventajas nativas.

## Consequences

### Positive
- Una sola fuente de verdad para `baseURL`, headers y timeout.
- Rutas relativas legibles; cambiar de host (o adoptar un prefijo futuro) es un cambio en un único lugar.
- Aislable y testeable.

### Negative
- Refactor de imports en todos los `*.api.ts` (de `@/utils/interceptor` a `@/utils/httpClient`).

### Neutral
- Se mantiene el feedback por snackbar global (lo consume el interceptor de respuesta, ver ADR-0005).

## References
- `listify-backend/src/main.ts` (no hay `setGlobalPrefix`)
- `listify-backend/docs/adr/0011-collaborative-shopping-lists.md` (deuda de prefijo documentada)
