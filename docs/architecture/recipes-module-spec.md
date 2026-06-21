# Spec: Módulo Recetas (pendiente en backend)

> Borrador de requisitos para que el equipo de backend construya el módulo `recipes`. Hasta entonces, el tab de la app es un placeholder (ver [ADR-0007](../adr/0007-modulo-recetas-diferido.md)).

## Objetivo

A partir de los productos y cantidades que el usuario ya tiene en su(s) **lista(s) de compras**, permitirle saber **qué y cuánto puede preparar**. La(s) lista(s) funcionan como **inventario/stock**: el usuario arma recetas eligiendo productos y cantidades, y el sistema calcula cuántas veces/porciones le alcanza y qué le sobra.

Caso de uso: personas que hacen **meal prep** o que arman **menús** con la compra que ya hicieron. **No** es un recetario de pasos de cocina ("cómo hornear un pastel"): es planificación de preparaciones sobre lo comprado.

## Concepto clave (relación invertida)

`lista(s) de compras → receta` (la lista es el inventario), **no** `receta → ingredientes → lista`.

- **Creación manual:** el usuario selecciona productos + cantidades (tomados de sus listas) para definir una receta/preparación.
- **Cantidades descontables:** cada receta consume stock; al planificar varias recetas, el consumo se acumula sobre el stock combinado.
- **Una o varias listas:** el stock puede combinar productos de múltiples listas seleccionadas.

## Casos de uso (app)

1. Crear una receta manualmente: nombre + items (`producto`, `cantidad` por preparación) + `porciones?` que rinde.
2. Ver el listado de mis recetas y el detalle de una.
3. Elegir una o varias listas como stock y ver, para una receta: **cuántas preparaciones** alcanzan, qué producto **limita** y el **sobrante** por producto.
4. (Opcional) Planificar varias recetas contra el mismo stock: ver factibilidad acumulada y sobrante final (qué menú me armo con lo que tengo).

## Modelo de datos propuesto (a validar por backend)

- **Recipe**: `id`, `userId`, `name`, `description?`, `servings?` (porciones que rinde una preparación), timestamps.
- **RecipeItem**: `id`, `recipeId`, `productId` (→ `Product`), `quantity` (cantidad por preparación), `unit?`, `notes?`.

> El vínculo `RecipeItem.productId → Product` es lo que permite cruzar con las cantidades de `ListItem` (mismo `productId`) para calcular stock.

## Cálculo de factibilidad ("cuánto puedo preparar")

Dado un conjunto de listas seleccionadas:

- `stock(p)` = suma de `ListItem.quantity` del producto `p` en las listas elegidas.
- `maxPreparaciones` = `floor( min( stock(p) / recipeItem.quantity(p) ) )` sobre los items de la receta.
- `sobrante(p)` = `stock(p) − maxPreparaciones × recipeItem.quantity(p)`.
- `limiting` = el/los producto(s) que determinan `maxPreparaciones`.
- `notCovered` = productos de la receta que no están en ninguna lista seleccionada.
- **Plan multi-receta:** se descuenta de forma **acumulada** sobre el stock combinado (cada receta consume su parte; se reporta el sobrante final).

## Endpoints propuestos (a definir por backend)

- `POST /recipes` — `{ name, description?, servings?, items: [{ productId, quantity, unit? }] }`
- `GET /recipes` — paginado (`page`, `pageSize`); del usuario de sesión.
- `GET /recipes/:id` — detalle con items.
- `PATCH /recipes/:id` — editar nombre/items/porciones.
- `DELETE /recipes/:id`
- `GET /recipes/:id/feasibility?listIds=...` — `{ maxBatches, perProduct: [{ productId, stock, required, remaining, limiting }], notCovered: [] }`
- (Opcional) `POST /recipes/plan` — `{ recipeIds: [], listIds: [] }` → factibilidad acumulada + sobrante final.

Convenciones esperadas (consistentes con el resto del backend): sin prefijo global, respuestas paginadas `{ data, meta }`, errores `{ statusCode, message, error }`, auth por sesión Bearer, recursos del usuario de sesión (`@CurrentUser`).

## Integración en la app (Fase 5, cuando exista backend)

- `api/recipes.api.ts` + tipos en `api/types/recipes.d.ts`.
- Hooks TanStack Query: `['recipes', params]`, `['recipe', id]`, `['recipe-feasibility', id, listIds]`.
- Reutiliza los datos de `shopping-lists` (Fase 3) como fuente de stock.
- Reemplazar el placeholder de `app/main/(main)/recipes.tsx` (lista, detalle y selector de listas para factibilidad).

## Pendiente / preguntas para backend

- ¿`quantity` por **preparación** o por **porción** (`servings`)?
- ¿Factibilidad calculada **on-the-fly** (plan, sin estado) vs **descuento persistente** del stock de la lista?
- ¿Cómo se normalizan **unidades** cuando la cantidad de la receta y la de la lista no coinciden (ej. gramos vs unidades)? ¿Match simple por `productId` y misma unidad como punto de partida?
- ¿La receta es por usuario (privada) o compartible como las listas?
