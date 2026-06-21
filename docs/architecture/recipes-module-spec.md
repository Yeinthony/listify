# Spec: Módulo Recetas (pendiente en backend)

> Borrador de requisitos para que el equipo de backend construya el módulo `recipes`. Hasta entonces, el tab de la app es un placeholder (ver [ADR-0007](../adr/0007-modulo-recetas-diferido.md)).

## Objetivo

Permitir a los usuarios explorar recetas y, a partir de sus ingredientes, alimentar el flujo central de Listify: buscar precios de los productos asociados y agregarlos a una lista de compras.

## Casos de uso (app)

1. Ver un listado/paginado de recetas (con imagen, título, tiempo, porciones).
2. Ver el detalle de una receta: ingredientes (con cantidad/unidad) y pasos.
3. Desde una receta, **agregar sus ingredientes a una lista de compras** (vínculo con `shopping-lists`).
4. (Opcional) Buscar/filtrar recetas por nombre, categoría o ingrediente.

## Modelo de datos propuesto (a validar por backend)

- **Recipe**: `id`, `title`, `description?`, `imageUrl?`, `servings?`, `prepTimeMin?`, `steps: string[]` (o entidad `RecipeStep`), `categoryId?`, timestamps.
- **RecipeIngredient**: `id`, `recipeId`, `productId?` (link a `Product` cuando aplique) o `name` libre, `quantity?`, `unit?`, `notes?`.

> El vínculo `RecipeIngredient.productId → Product` es clave para reutilizar precios/`nearby-prices` y el optimizador de listas.

## Endpoints propuestos (a definir por backend)

- `GET /recipes` — paginado (`page`, `pageSize`), filtros opcionales (`q`, `categoryId`).
- `GET /recipes/:id` — detalle con ingredientes y pasos.
- `POST /shopping-lists/:id/from-recipe/:recipeId` *(o equivalente)* — agrega los ingredientes de una receta a una lista.

Convenciones esperadas (consistentes con el resto del backend): sin prefijo global, respuestas paginadas `{ data, meta }`, errores `{ statusCode, message, error }`, auth por sesión Bearer.

## Integración en la app (Fase 5, cuando exista backend)

- `api/recipes.api.ts` + tipos en `api/types/recipes.d.ts`.
- Hooks TanStack Query: `['recipes', params]`, `['recipe', id]`.
- Reemplazar el placeholder de `app/main/(main)/recipes.tsx` y pantalla de detalle.

## Pendiente / preguntas para backend

- ¿Origen de las recetas (curadas, importadas, generadas)?
- ¿`steps` como array de strings o entidad propia?
- ¿Matching de ingredientes a `Product` por EAN, por nombre, o manual?
