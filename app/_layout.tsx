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
const ClerkPublishableKey = "pk_test_aW1tb3J0YWwtdHJvbGwtMzkuY2xlcmsuYWNjb3VudHMuZGV2JA";
const StripePublishableKey = "pk_test_51PJNNlGfVO2eEzjSWFlEPrAO7Fjsw918Iq16sjQjWzGRnCf9J1q314U0fXsYfXD3amw4Pund0xiqFV3SnhVUifkk00x2n6qBZx";
SplashScreen.preventAutoHideAsync();

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    regular: require("@/assets/fonts/Poppins-Regular.ttf"),
    medium: require("@/assets/fonts/Poppins-Medium.ttf"),
    bold: require("@/assets/fonts/Poppins-Bold.ttf"),
    semi_bold: require("@/assets/fonts/Poppins-SemiBold.ttf"),
    extra_bold: require("@/assets/fonts/Poppins-ExtraBold.ttf"),
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
