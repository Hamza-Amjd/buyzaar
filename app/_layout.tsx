import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StripeProvider } from "@stripe/stripe-react-native";
import { tokenCache } from "@/utils/healper";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useFonts } from "expo-font";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { usePushNotifications } from "@/hooks/usePushNotification";
const ClerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;
const StripePublishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});
// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    poppins_medium: require("@/assets/fonts/Poppins-Medium.ttf"),
    poppins_bold: require("@/assets/fonts/Poppins-Bold.ttf"),
  });
  const { expoPushToken, fcmToken } = usePushNotifications();
  useEffect(() => {
    if (!loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  if (!loaded) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={ClerkPublishableKey}
      >
        <ClerkLoaded>
          <StripeProvider publishableKey={StripePublishableKey}>
            <BottomSheetModalProvider>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <Stack
                  initialRouteName={"(tabs)"}
                  screenOptions={{
                    headerShown: false,
                    statusBarBackgroundColor:
                      Colors[colorScheme ?? "light"].background,
                    statusBarStyle: colorScheme === "dark" ? "light" : "dark",
                  }}
                >
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="(auth)" />
                </Stack>
              </ThemeProvider>
            </BottomSheetModalProvider>
          </StripeProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
