import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import store from "@/redux/store";
import { ModalPortal } from "react-native-modals";
import { usePushNotifications } from "@/components/usePushNotification";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { expoPushToken, notification } = usePushNotifications();
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/Poppins-Medium.ttf"),
  });
  useEffect(() => {
    (async () => {
      const userID = await AsyncStorage.getItem("userId");
      if (!userID) {
        setisLoggedIn(false);;
      } else {
        setisLoggedIn(true);
      }
    })();
  }, []);
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <Stack
            initialRouteName={isLoggedIn?"/(tabs)/index":"(auth)"}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="address" />
            <Stack.Screen name="category" />
            <Stack.Screen name="productdetails" />
            <Stack.Screen name="cart" />
            <Stack.Screen name="confirmorder" />
            <Stack.Screen name="orders" />
            <Stack.Screen name="favorities" />
          </Stack>
          <ModalPortal />
        </Provider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
