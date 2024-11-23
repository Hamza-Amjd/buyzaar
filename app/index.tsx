import { ActivityIndicator } from "react-native";
import React, { useEffect } from "react";

import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, router } from "expo-router";

const Main = () => {
  const { isLoaded, isSignedIn } = useAuth();
    if (!isLoaded) {
    return (
      <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </ThemedView>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)" />;
};

export default Main;
