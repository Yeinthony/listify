# Architecture Decision Records — App Móvil Listify

Registro de decisiones de arquitectura de la app móvil (Expo / React Native). Formato basado en la convención del backend (`listify-backend/docs/adr`).

| ADR | Título | Estado |
|-----|--------|--------|
| [0001](0001-cliente-http-axios.md) | Cliente HTTP con instancia Axios dedicada | Accepted |
| [0002](0002-tanstack-query.md) | TanStack Query para estado de servidor | Accepted |
| [0003](0003-sesion-token-securestore.md) | Sesión y token (Bearer opaco + SecureStore) | Accepted |
| [0004](0004-contrato-tipos-paginacion.md) | Contrato de tipos y envoltorio paginado | Accepted |
| [0005](0005-normalizacion-errores.md) | Normalización de errores de API | Accepted |
| [0006](0006-configuracion-entorno-baseurl.md) | Configuración de entorno y baseURL | Accepted |
| [0007](0007-modulo-recetas-diferido.md) | Módulo Recetas diferido | Accepted (bloqueado por backend) |
| [0008](0008-estrategia-testing.md) | Estrategia de Testing (app móvil) | Accepted |
| [0009](0009-libreria-de-mapas.md) | Una sola librería de mapas (`react-native-maps`) | Accepted |

> Contexto general y mapa de integración en [`../architecture/integration.md`](../architecture/integration.md).
