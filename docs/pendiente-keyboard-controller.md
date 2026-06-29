# Pendiente: reactivar `react-native-keyboard-controller`

**Estado:** la dependencia está **instalada** (`package.json`, `react-native-keyboard-controller`) pero **sin uso en código**, para que el dev client actual (que aún no incluye el módulo nativo) **no crashee**.

**Por qué está desactivado:** es un módulo nativo. Requiere **rebuild del dev client** (`npx expo run:android` o `eas build --profile development`). El rebuild tarda, así que se difirió.

**Objetivo:** manejo global del teclado (los inputs suben sobre el teclado) en pantallas y dentro de los bottom sheets. La causa raíz alternativa es `app.json` → `android.softwareKeyboardLayoutMode: "pan"` (con la librería NO hace falta tocarlo).

## Pasos para reactivar (después del rebuild)

1. **`npx expo run:android`** (o nuevo build EAS de development) para incluir el módulo nativo.

2. **`app/_layout.tsx`** — envolver el árbol con `KeyboardProvider`:
   ```tsx
   import { KeyboardProvider } from 'react-native-keyboard-controller';
   // ...
   return (
     <KeyboardProvider>
       <QueryClientProvider client={queryClient}>
         {/* ...resto igual... */}
       </QueryClientProvider>
     </KeyboardProvider>
   );
   ```

3. **`components/generals/Container.tsx`** — usar el `KeyboardAvoidingView` de la librería:
   ```tsx
   import { RefreshControl, ScrollView, View, Platform } from 'react-native';
   import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
   ```
   (mantener `behavior="padding"`).

4. **`app/(auth)/_layout.tsx`** — importar `KeyboardAvoidingView` de la librería y poner `behavior="padding"` (la versión actual usa el de react-native con `behavior` condicional a iOS):
   ```tsx
   import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
   // <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={0}>
   ```

5. **`components/modals/StoreSelectModal.tsx`** y **`components/modals/BranchSelectModal.tsx`** — envolver el contenido del `ActionsheetContent` (heading + `SearchText` + lista) en:
   ```tsx
   import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
   // <KeyboardAvoidingView behavior="padding" style={{ width: '100%' }}> ...contenido... </KeyboardAvoidingView>
   ```

## Caveat a verificar tras reactivar

Los `Actionsheet` de gluestack en Android pueden montarse en una ventana `Modal` aparte. Si tras el rebuild el buscador dentro del sheet **todavía** queda tapado por el teclado, envolver el contenido del sheet en su propio `KeyboardProvider` (la librería lo soporta para modales) o usar `KeyboardAwareScrollView`.
