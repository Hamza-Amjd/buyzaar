import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
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
import { useColorScheme } from "react-native";
const ClerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;
const StripePublishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
SplashScreen.preventAutoHideAsync();

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { expoPushToken, fcmToken } = usePushNotifications();
  console.log(fcmToken)
  const [loaded] = useFonts({
    regular: require("@/assets/fonts/Poppins-Regular.ttf"),
    medium: require("@/assets/fonts/Poppins-Medium.ttf"),
    bold: require("@/assets/fonts/Poppins-Bold.ttf"),
    semi_bold: require("@/assets/fonts/Poppins-SemiBold.ttf"),
    extra_bold: require("@/assets/fonts/Poppins-ExtraBold.ttf"),
  });
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
                  <Stack.Screen name="(screens)" />
                </Stack>
              </ThemeProvider>
            </BottomSheetModalProvider>
          </StripeProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
