# ADR-0008: Estrategia de Testing (App Móvil)

## Status
Accepted

## Context

La app móvil no tiene tests más allá del preset `jest-expo` ya configurado (`package.json`: `"test": "jest --watchAll"`, devDeps `jest`, `jest-expo`, `react-test-renderer`). A medida que se integra el backend (capa `httpClient`, normalización de errores, hooks TanStack Query, flujo de sesión), el riesgo se concentra en lógica fácil de romper sin feedback.

Se replica la **filosofía del backend** (ver `listify-backend/docs/adr/0013`): pirámide de tests, **cobertura por riesgo (no por porcentaje)** y **mockear solo bordes externos**, adaptada al stack Expo/React Native.

## Decision

Adoptar una **pirámide de 3 niveles** con cobertura priorizada por riesgo.

### Niveles

1. **Unit tests** (mayoría)
   - Co-located: `*.spec.ts(x)` junto al archivo de producción (igual que el backend).
   - Solo lógica pura, sin I/O ni render: schemas Zod (`utils/formSchemes.ts`), normalización de errores (`ApiError`, ADR-0005), helpers de `utils/`, funciones de `api/*.ts` con el `httpClient` mockeado.
   - Watch en desarrollo: `npm test`.

2. **Component / hook tests** (medios)
   - `@testing-library/react-native` (a agregar) + `@testing-library/react-hooks` (o `renderHook` de RNTL).
   - Cubren componentes con lógica (formularios, modales) y hooks de feature (`useQuery`/`useMutation`) con el QueryClient de test y la red mockeada (MSW o mock de `httpClient`).
   - Se corren antes de push / en CI: `npm run test:ci`.

3. **E2E tests** (pocos)
   - **Maestro** (recomendado para Expo) — flujos felices críticos: login + rehidratación de sesión, escanear EAN → detalle de producto, crear lista + ítems.
   - Opcional / posterior; se corren en CI cuando estén.

### Reglas de diseño
1. **Mockear solo bordes externos**: red (HTTP), módulos nativos (`expo-secure-store`, `expo-location`, `expo-camera`). La lógica propia se testea real.
2. **No testear componentes presentacionales sin lógica** con tests dedicados; se cubren indirectamente.
3. **Cobertura por riesgo, no por porcentaje**: sin umbral mínimo de `coverage`. Las áreas P0/P1 son obligatorias; el resto opcional.
4. **Lógica fuera del componente**: si un componente tiene lógica compleja, se mueve a un hook/util testeable (alineado con `composition-patterns`).

### Prioridad de cobertura

| Prioridad | Área | Nivel | Razón |
|-----------|------|-------|-------|
| P0 | Flujo de sesión: token, `whoami`, 401 → logout (ADR-0003) | Unit + Component | Seguridad/acceso |
| P0 | Normalización de errores `ApiError` (ADR-0005) | Unit | Afecta toda la app |
| P1 | Schemas Zod de formularios | Unit | Validación de entrada |
| P1 | Funciones `api/*.ts` (URL, params, parseo) | Unit | Contrato con backend |
| P2 | Hooks TanStack Query (caché/invalidación) | Component | Sincronización de datos |
| P2 | Lógica de mapa/cercanía (distancia, filtros) | Unit | Lógica compleja |
| P3 | Componentes presentacionales | — | Bajo riesgo |

### Stack de testing

| Herramienta | Uso | Estado |
|-------------|-----|--------|
| Jest + `jest-expo` | Runner | Ya instalado |
| `@testing-library/react-native` | Render/interacción de componentes y hooks | **A agregar** |
| MSW (`msw`) | Mock de red a nivel HTTP | **A agregar** (o mock de `httpClient`) |
| `@tanstack/react-query` (test utils) | QueryClient aislado por test | Con ADR-0002 |
| Maestro | E2E flujos críticos | **A agregar (posterior)** |

### Qué mockear y qué no

| Dependencia | Mockear? | Razón |
|-------------|----------|-------|
| Red / backend HTTP | ✅ | MSW o mock de `httpClient`; tests deterministas |
| `expo-secure-store` | ✅ | No hay keychain en el entorno de test |
| `expo-location` / `expo-camera` | ✅ | Hardware no disponible en test |
| Lógica propia (schemas, utils, normalización) | ❌ | Es lo que se quiere validar |
| TanStack Query | ❌ | Se usa un QueryClient real aislado por test |

## Alternatives Considered

**Detox en vez de Maestro (E2E)** — Considerado. Maestro es más simple de configurar con Expo y menos frágil; Detox queda como opción si se necesita control más fino.

**Umbral de coverage mínimo (ej. 80%)** — Rechazado, igual que en el backend: mide líneas ejecutadas, no comportamiento; incentiva tests triviales.

**Snapshot tests masivos de UI** — Rechazado como estrategia principal: frágiles y de bajo valor; se usan puntualmente si aportan.

## Consequences

### Positive
- Feedback rápido por unit tests co-located; áreas de riesgo cubiertas explícitamente.
- Tests deterministas al mockear red y módulos nativos.
- Consistencia conceptual con el backend (misma filosofía de riesgo).

### Negative
- Hay que agregar dependencias (`@testing-library/react-native`, `msw`, Maestro).
- Mockear módulos nativos requiere setup inicial (`jest.setup`).

### Neutral
- Los componentes sin lógica no tienen test propio (deseado: empuja la lógica a hooks/utils).

## References
- `listify-backend/docs/adr/0013-testing-strategy.md`
- `package.json` (preset `jest-expo`)
- Skills `composition-patterns`, `react-best-practices`
