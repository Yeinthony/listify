# Precios de la lista por sucursal (branch-prices)

Permite, desde el detalle de una `shopping-list`, elegir una **sucursal** (visualmente en un mapa,
viendo dónde está la sucursal y dónde está el usuario) y ver el **precio de cada producto + el total**
de la lista **en esa sucursal** (precios reales, con descuentos y conversión de moneda opcionales).

Complementa al **optimizador** (que devuelve la canasta más barata): acá el usuario **elige** la
sucursal y ve la lista repreciada ahí.

## Contrato del backend (implementado en `../listify-backend`)

`POST /shopping-lists/:id/branch-prices` · `HttpCode 200` · guards `ListAccessGuard` + `ListRole('reader')`.

### Request (`BranchPricesDto`)

| Campo | Tipo | Default | Notas |
|---|---|---|---|
| `lat` | number | — | -90..90 |
| `lng` | number | — | -180..180 |
| `km` | number | — | > 0 (radio) |
| `limit` | number? | 30 | 1..100, sucursales devueltas (por distancia) |
| `channel` | `'minorista'\|'mayorista'`? | `'minorista'` | minorista usa `listPrice`, mayorista `unitPriceWithTax` |
| `applyDiscounts` | boolean? | true | descuentos por método de pago del usuario |
| `currency` | `'ars'\|'all'\|'usd'`? | `'ars'` | conversión vía `exchange-rate` |
| `exchangeType` | `'blue'\|'oficial'\|'mep'\|'ccl'`? | — | |

### Response

```ts
{
  channel: 'minorista' | 'mayorista';
  currency: 'ars' | 'all' | 'usd';
  totalItems: number;                 // nº de líneas de la lista
  branches: Array<{
    branchId: string;
    storeId: string;
    storeName: string;
    brandId: number;
    branchName: string | null;
    address: string | null;
    latitude: number | null;          // puede ser null → no se ubica en el mapa
    longitude: number | null;
    distanceMeters: number;
    coveredItems: number;             // productos de la lista disponibles en la sucursal
    total: number;                    // Σ unitPrice*quantity (cubiertos), sin descuento
    appliedDiscount: { id: string; percent: number; amount: number; paymentMethod: string } | null;
    totalWithDiscount: number;
    items: Array<{ productId: string; quantity: number; unitPrice: number; subtotal: number }>; // solo cubiertos
  }>;
}
```

- `branches` ordenadas por `distanceMeters` asc, cortadas a `limit`.
- La app cruza `items[].productId` con la lista para marcar **no disponibles** (`totalItems - coveredItems`).
- Reusa la lógica del optimizador (query de precios cercanos + candidates + descuentos + conversión),
  así los precios son consistentes. Caché 300s.

## Integración mobile

### Capa de datos

- `types/shopping-lists.d.ts`: `BranchPriceItem`, `BranchPriceEntry`, `ListBranchPrices`.
- `api/types/shopping-lists.d.ts`: `BranchPricesPayload`.
- `api/shoppingLists.api.ts`: `getListBranchPrices(id, payload)`.
- `api/queryKeys.ts`: `shoppingListKeys.branchPrices(id, params)`.
- `hooks/screens/useListBranchPrices.ts`: toma ubicación (`expo-location`) + `km` (estado de pantalla)
  y consulta vía `useQuery` (key por `listId`/coords/km/channel; refetch al cambiar `km`).

### UI (pendiente)

- Entrada en el detalle de lista → pantalla `app/main/list-branch-prices.tsx` con **mapa** (`expo-maps`,
  reusando el patrón de `BranchsMapModal`): markers de sucursales + ubicación del usuario + filtro de
  distancia.
- Selección de sucursal (lista/carrusel inferior sobre el mapa, robusto frente a la detección de tap
  en markers de `expo-maps`) → repreciar la lista en esa sucursal (por producto + total + descuento),
  marcando los items no disponibles.

### Notas

- `latitude`/`longitude`/`branchName`/`address` pueden ser `null`: para el mapa se filtran las
  sucursales sin coordenadas (igual pueden listarse).
- En `BranchsMapModal`, el mapa de iOS (`AppleMaps.View`) hoy no recibe markers/cámara (limitación
  pre-existente); a tener en cuenta al reusar el patrón.

## Estado

- Backend: **hecho** (revisado, coincide con el contrato).
- Mobile: capa de datos **en curso**; UI pendiente.
