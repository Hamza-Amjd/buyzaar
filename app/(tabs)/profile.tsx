import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/ThemedText";
import { router } from "expo-router";
import { ThemedView } from "@/components/ui/ThemedView";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { useAddressStore } from "@/services/addressStore";
import CartIcon from "@/components/cart/CartIcon";
import useCartStore from "@/services/cartStore";

const profile = () => {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { signOut } = useAuth();
  const { clearCart } = useCartStore();
  const { removeAddresses } = useAddressStore();

  const logout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout", [
      { text: "Cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          clearCart();
          removeAddresses();
          await signOut();
          router.push("/(auth)");
        },
      },
    ]);
  };

  const menuitems = [
    {
      name: "Wishlist",
      iconName: "bookmark-sharp",
      function: () => router.push("/wishlist"),
    },
    { name: "Cart", icon: <CartIcon size={25}/>, function: () => router.push("/cart") },
    { name: "Orders", iconName: "bag", function: () => router.push("/orders") },
    { name: "To Review", iconName: "star", function: () => router.push("/orders") },
    { name: "Payment info", iconName: "card", function: () => {} },
    {
      name: "Settings",
      iconName: "settings",
      function: () => router.push("/settings"),
    },
    {
      name: "Privacy policy",
      iconName: "shield-checkmark",
      function: () =>
        WebBrowser.openBrowserAsync(
          "https://buyzaar.vercel.app/site/privacypolicy"
        ),
    },
    { name: "Log out", iconName: "log-out", function: logout },
  ];
  return (
    <ThemedView style={styles.container}>
      <View style={styles.userDetails}>
        {user?.id ? (
          <Image
            style={styles.dp}
            source={{ uri: user?.imageUrl }}
            loadingIndicatorSource={require("@/assets/images/userDefault.png")}
          />
        ) : (
          <Image
            style={styles.dp}
            source={require("@/assets/images/userDefault.png")}
          />
        )}
        {loading ? (
          <ActivityIndicator style={{ height: 100 }} />
        ) : user ? (
          <View
            style={styles.nameTxtContainer}
          >
            <ThemedText
              type="subtitle"
              style={[
                styles.nameTxt,
                { borderColor: Colors[colorScheme ?? "light"].text },
              ]}
            >
              {user?.firstName + " " + user?.lastName}
            </ThemedText>
            <ThemedText type="defaultSemiBold">
              {user && user?.emailAddresses[0].emailAddress}
            </ThemedText>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.nameTxt,
              { borderColor: Colors[colorScheme ?? "light"].text },
            ]}
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
              {menu?.icon??<Ionicons
                name={menu.iconName as any}
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />}
              <ThemedText type="mediumSemiBold"> {menu.name}</ThemedText>
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
    backgroundColor: "#FFF",
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
    gap:10,
    width: "100%",
    marginBottom: 10,
    flexDirection: "row",
  },
  nameTxtContainer: {
      height: 100,
      alignItems: "center",
      justifyContent: "center",
  },
  nameTxt: {
    borderWidth: 2,
    borderRadius: 25,
    padding: 10,
    marginBottom: 10,
  },
});
