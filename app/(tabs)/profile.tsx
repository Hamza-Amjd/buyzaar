import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  useColorScheme,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import {
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/ThemedText";
import {router} from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { getUser } from "@/utils/actions";
import { useAuth, useUser } from "@clerk/clerk-expo";

const profile = () => {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { signOut } = useAuth();
 
  const logout = () => {
    Alert.alert("Logout", "Are you sure you want to logout", [
      { text: "Cancel" },
      {
        text: "Confirm",
        onPress: () => signOut()
      },
    ]);
  };

  const menuitems = [
    {
      name: "Wishlist",
      icon: "bookmark-sharp",
      function: () => router.push("/wishlist"),
    },
    { name: "Cart", icon: "cart", function: () => router.push("/cart") },
    { name: "Orders", icon: "bag", function: () => router.push("/orders") },
    { name: "To Review", icon: "star", function: () => {} },
    { name: "Payment info", icon: "card", function: () => {} },
    { name: "Settings", icon: "settings", function: () => {} },
    {
      name: "Privacy policy",
      icon: "shield-checkmark",
      function: () => Linking.openURL("https://buyzaar.vercel.app/"),
    },
    { name: "Log out", icon: "log-out", function: logout },
  ];
  return (
    <ThemedView style={styles.container}>
      <View style={styles.userDetails}>
        {user && <Image
          style={styles.dp}
          source={{uri:user?.imageUrl}}
        />}
        {loading ? (
          <ActivityIndicator style={{ height: 100 }} />
        ) : user ? (
          <View
            style={{
              height: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                borderColor: Colors[colorScheme ?? "light"].text,
                borderWidth: 2,
                borderRadius: 25,
                padding: 10,
              }}
            >
              <ThemedText type="subtitle">{user?.firstName+" "+user?.lastName}</ThemedText>
            </View>
              <ThemedText type="defaultSemiBold">
                {user && user?.emailAddresses[0].emailAddress}
              </ThemedText>
          </View>
        ) : (
          <TouchableOpacity
            style={{
              borderColor: Colors[colorScheme ?? "light"].text,
              borderWidth: 2,
              borderRadius: 25,
              padding: 10,
            }}
            onPress={() => router.push("/(auth)")}
          >
            <ThemedText type="subtitle">Signup to your account</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.menu}>
        {menuitems.map((menu, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={menu.function}
              style={[
                styles.menuItem,
                { backgroundColor: Colors[colorScheme ?? "light"].background2 },
              ]}
            >
              {/* @ts-ignore */}
              <Ionicons name={menu.icon}
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
              <ThemedText type="subtitle"> {menu.name}</ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </ThemedView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  userDetails: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    height: 200,
  },
  dp: {
    width: 100,
    height: 100,
    bottom: 10,
    borderRadius: 100,
  },
  menu: {
    alignItems: "flex-start",
    marginTop: 50,
  },
  menuItem: {
    padding: 5,
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
    flexDirection: "row",
  },
});
