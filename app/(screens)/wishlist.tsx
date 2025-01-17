import {
  FlatList,
} from "react-native";
import React from "react";
import Product from "@/components/home/ProductCard";
import AnimatedLottieView from "lottie-react-native";
import { ThemedView } from "@/components/ui/ThemedView";
import Header from "@/components/ui/Header";
import useCartStore from "@/services/cartStore";
import EmptyListView from "@/components/ui/EmptyListView";

const wishlist = () => {
  const wishlist=useCartStore().wishlist;
  return (
    <ThemedView style={{flex:1}}>
      <Header title="Wishlist"/>
      {wishlist.length == 0 && (
        <EmptyListView style={{paddingTop:200}}/>
      )}
      <FlatList
        data={wishlist}
        keyExtractor={(item: any) => item._id}
        renderItem={({ item }) => <Product item={item} />}
        numColumns={2}
        contentContainerStyle={{
          justifyContent:'space-evenly'
        }}
        columnWrapperStyle={{ marginHorizontal: 10 }}
      />
    </ThemedView>
  );
};

export default wishlist;