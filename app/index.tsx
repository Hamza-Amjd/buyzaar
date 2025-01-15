import { ActivityIndicator } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ui/ThemedView";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

const Main = () => {
  const { isLoaded, isSignedIn } = useAuth();
    if (!isLoaded) {
    return (
      <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large"/>
      </ThemedView>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)" />;
};

export default Main;
