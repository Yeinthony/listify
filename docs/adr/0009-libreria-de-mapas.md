# ADR-0009: Una sola librería de mapas (`react-native-maps`)

## Status
Accepted

## Context

La app tenía **dos librerías de mapas nativas** instaladas y en uso simultáneo:

- **`expo-maps` 0.12.9** — `BranchsMapModal`, `app/main/list-optimizer.tsx`, `app/main/list-branch-prices.tsx`
- **`react-native-maps` 1.26.20** — `components/cards/LocationCard.tsx`, `components/modals/AddLocationMapModal.tsx`

La convivencia **no producía fallos**: se verificó en dispositivo montando las dos a la vez (el mapa de sucursales con el modal de alta de ubicación anidado encima) y funciona. Tampoco hay conflicto de renderer nativo: `react-native-maps` llama a `MapsInitializer` con `LATEST` y `expo-maps` no lo llama explícitamente (lo hace `maps-compose`, también `LATEST`); ambas resuelven al mismo `play-services-maps`.

El costo era de mantenimiento: dos SDKs de mapas en el bundle nativo, dos APIs distintas, y el fork `Platform.OS === 'ios' ? <AppleMaps.View/> : <GoogleMaps.View/>` repetido en tres archivos.

Además, `expo-maps` tiene limitaciones duras para los casos de uso del repo:

- Se declara **alpha** ("subject to breaking changes", "not available in the Expo Go app", "contributions are not encouraged at this time").
- Exige un **deployment target mínimo de iOS 18.0**.
- **No tiene lite mode.** `LocationCard` dibuja un mini-mapa por fila en una lista scrolleable; con `expo-maps` cada tarjeta sería un `GoogleMap` de Compose completo.
- **No tiene evento de "movimiento terminado"**, solo `onCameraMove` continuo. El picker de dirección (`useAddLocationMapModal`) usa `onRegionChangeStart`/`onRegionChangeComplete` para disparar el reverse geocoding de LocationIQ solo cuando el mapa se frena; con `expo-maps` habría que debouncear a mano contra una API con rate limit.

## Decision

- **`react-native-maps` es la única librería de mapas** de la app.
- Se migran las tres pantallas que usaban `expo-maps` y se desinstala el paquete (y su plugin en `app.json`).
- Se conserva `android.config.googleMaps.apiKey` en `app.json`: `react-native-maps` usa esa misma key del manifest en Android. En iOS usa Apple Maps por defecto, sin key.
- **La cámara se maneja por región, no por zoom.** En `react-native-maps`, `Camera.zoom` es solo Google Maps y `Camera.altitude` solo Apple Maps, así que un `camera={{ zoom }}` no controla el zoom en iOS. Las tres pantallas ya derivaban el zoom de un radio en km, de modo que se usa el helper `utils/mapRegion.ts` → `regionForKm(lat, lng, km, scale)`.
- **Patrón de cámara: `initialRegion` + `mapRef.animateToRegion(...)`** en un efecto, no `region` como prop controlada (pelea con el paneo del usuario y lo devuelve de un salto). Es el patrón que ya usaba `useAddLocationMapModal` con `animateCamera`.

## Alternatives Considered

**Quedarse con `expo-maps`** — Rechazado. Es first-party de Expo y en iOS usa Apple Maps vía SwiftUI, pero el piso de iOS 18 corta demasiado alcance para el MVP, es alpha, y le faltan dos cosas que el repo ya usa: lite mode y evento de fin de movimiento. Migrar el picker de dirección implicaría reimplementar el debounce del reverse geocoding sobre una feature que ya funciona.

**Dejar las dos** — Rechazado. Funciona, pero deja dos SDKs de mapas en el bundle nativo, dos APIs que mantener y el fork por plataforma repetido en tres archivos.

## Consequences

### Positive
- Una sola API de mapas, cross-platform: desaparece el fork `Platform.OS` de las tres pantallas.
- Se arregla el mapa en blanco en iOS de `BranchsMapModal`, que renderizaba `<AppleMaps.View />` sin cámara ni markers.
- Un SDK de mapas menos en el build nativo.
- Se eliminan las tres tablas de zoom por km (`ZOOM_BY_KM` estaba duplicada en dos pantallas, más `ZOOM_BY_DISTANCE`).

### Negative
- Se resigna el mapa first-party de Expo y Apple Maps vía SwiftUI en iOS.
- Se tocaron tres pantallas que ya funcionaban en Android (`list-branch-prices` en particular tuvo mucha iteración de diseño), así que requiere reverificación en dispositivo.
- Sacar `expo-maps` cambia las dependencias nativas: hace falta un rebuild (`npx expo run:android` o build EAS de development).

### Neutral
- `expo-image` queda sin uso (sus dos `useImage` solo alimentaban el `icon` de los markers de `expo-maps`). No se desinstala: es dependencia habitual del stack Expo.
- `AddLocationMapModal` usa `camera={{ zoom: 18 }}`; en iOS el zoom se controla con `altitude`, así que ahí el nivel quedará en el default de Apple Maps. Es previo a esta decisión y hoy iOS no está configurado para builds (`app.json` no tiene `ios.bundleIdentifier`).

## References
- `utils/mapRegion.ts`
- `components/modals/BranchsMapModal.tsx`, `app/main/list-optimizer.tsx`, `app/main/list-branch-prices.tsx`
- `components/cards/LocationCard.tsx`, `components/modals/AddLocationMapModal.tsx`
- `docs/architecture/list-branch-prices.md`
