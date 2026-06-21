export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function AppLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar 
        style='light'
      />
      <Stack>
        <Stack.Screen 
          name="(main)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="personal-data" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="product-details" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="manage-locations"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="list-detail"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="list-optimizer"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="list-collaborators"
          options={{ headerShown: false }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
