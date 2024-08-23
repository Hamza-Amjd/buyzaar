import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useColorScheme,
} from "react-native";
import React, { useState, useEffect } from "react";
import Product from "../components/ProductCard";
import AnimatedLottieView from "lottie-react-native";
import { ThemedView } from "@/components/ThemedView";
import Header from "@/components/Header";
import useCart from "@/hooks/useCart";

const wishlist = () => {
  const wishlist=useCart().wishlist;
  const colorScheme = useColorScheme();
  return (
    <ThemedView style={{flex:1, paddingTop:35}}>
      <Header title="Wishlist"/>
      {wishlist.length == 0 && (
        <AnimatedLottieView
          autoPlay
          loop
          speed={0.3}
          style={{ height: 150, width: 150, alignSelf: "center" ,top:250 }}
          source={require("../assets/images/emptyCart.json")}
        />
      )}
      <FlatList
        data={wishlist}
        keyExtractor={(item: any) => item._id}
        renderItem={({ item }) => <Product item={item} />}
        numColumns={2}
        contentContainerStyle={{
          columnGap: 15,
          rowGap: 10,
        }}
        columnWrapperStyle={{ marginHorizontal: 10 }}
        style={{ marginBottom: 60 }}
      />
    </ThemedView>
  );
};
const styles = StyleSheet.create({
  bar: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default wishlist;