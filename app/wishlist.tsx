import {
  FlatList,
  useColorScheme,
} from "react-native";
import React from "react";
import Product from "../components/ProductCard";
import AnimatedLottieView from "lottie-react-native";
import { ThemedView } from "@/components/ThemedView";
import Header from "@/components/Header";
import useCart from "@/hooks/useCart";

const wishlist = () => {
  const wishlist=useCart().wishlist;
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
           marginHorizontal:'auto',justifyContent:'space-evenly'
        }}
        columnWrapperStyle={{ marginHorizontal: 10 }}
      />
    </ThemedView>
  );
};

export default wishlist;