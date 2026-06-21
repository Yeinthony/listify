import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { Slot, usePathname } from 'expo-router';
import { SpinnerModalProvider } from '@/contexts/SpinnerModalContext';
import { useColorScheme } from 'react-native';
import useThemeStore from '@/store/themeStore';
import Snackbar from '@/components/generals/Snackbar';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/queryClient';
import '@/utils/i18n';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [styleLoaded, setStyleLoaded] = useState(false);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { theme, loadTheme } = useThemeStore()
  const colorScheme = useColorScheme()
  const pathname = usePathname();

  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    loadTheme()
  }, [])

  useEffect(() => { 
    if(theme === 'system'){
      setColorMode(colorScheme === 'light' ? 'light' : 'dark')
    }else {
      setColorMode(theme)
    }
  }, [theme, colorScheme])
  

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode={theme}>
        <ThemeProvider value={colorMode === 'dark' ? DarkTheme : DefaultTheme}>
          <SpinnerModalProvider>
            <Slot />
            <Snackbar />
          </SpinnerModalProvider>
        </ThemeProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
