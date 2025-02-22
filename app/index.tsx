import { ActivityIndicator, Alert, Image } from "react-native";
import React, { useEffect } from "react";
import { ThemedView } from "@/components/ui/ThemedView";
import { useAuth } from "@clerk/clerk-expo";
import {  router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useCartStore from "@/services/cartStore";

const Main = () => {
  const { isLoaded, isSignedIn } = useAuth();

    const tokenCheck = async () => {
      const isFirstStart = await AsyncStorage.getItem("isFirstStart");
      if (isFirstStart==null) {
        router.replace("/(screens)/onboarding");
        return false;
      }
      if (isLoaded && !isSignedIn) {
        router.replace("/(auth)");
        return false;
      }
      if (isLoaded && isSignedIn) {
        router.replace("/(tabs)");
        return true;
      }
    };

    useEffect(() => {
      const timeoutId = setTimeout(tokenCheck, 100);
      return () => clearTimeout(timeoutId);
    }, []);

  return (
    <ThemedView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Image source={require('@/assets/images/adaptive-icon.png')} style={{height:200,width:200}}/>
    </ThemedView>
  );
};

export default Main;
