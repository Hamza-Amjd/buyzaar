import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { ClerkLoaded, ClerkProvider} from "@clerk/clerk-expo";
import { Slot, Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ModalPortal } from "react-native-modals";
import { StripeProvider } from "@stripe/stripe-react-native";
import { tokenCache } from "@/utils/healper";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { Colors } from "@/constants/Colors";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});
SplashScreen.preventAutoHideAsync();
function InitialLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName={"(tabs)"} screenOptions={{ headerShown: false,statusBarBackgroundColor:Colors[colorScheme??'light'].background,statusBarStyle:colorScheme==="dark"?"light":"dark" }} >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="addAddress" />
        <Stack.Screen name="category" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="onboarding" />
      </Stack>
      <ModalPortal />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    poppins_medium: require("@/assets/fonts/Poppins-Medium.ttf"),
    poppins_bold: require("@/assets/fonts/Poppins-Bold.ttf"),
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  if (!loaded) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider
        publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      >
        <ClerkProvider
          tokenCache={tokenCache}
          publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        >
          <ClerkLoaded>
            <InitialLayout />
          </ClerkLoaded>
        </ClerkProvider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}
