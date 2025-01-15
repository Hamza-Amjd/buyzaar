import {
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import {  MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/ThemedText";
import {  useLocalSearchParams } from "expo-router";
import Header from "@/components/ui/Header";
import { getSearchedProducts } from "@/services/api/actions";
import ProductCard from "@/components/home/ProductCard";
import { ThemedView } from "@/components/ui/ThemedView";

export default function category() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const height= Dimensions.get('screen').height;
  useEffect(() => {
    (async () => {
      await getSearchedProducts(name)
        .then((results) => setProducts(results))
        .finally(() => setLoading(false));
    })();
  }, []);

  return (
    <ThemedView style={{ flex: 1}}>
      <Header/>

      <FlatList
        data={products}
        keyExtractor={(item: any, index) => item._id + index}
        renderItem={({ item }) => <ProductCard item={item} />}
        ListEmptyComponent={() => (
          <View
            style={{
              height:height-150,
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            {loading ? (
              <ActivityIndicator size={"large"} />
            ) : (
              <>
                <MaterialCommunityIcons
                  name={"text-box-search"}
                  color={"grey"}
                  size={80}
                />

                <ThemedText type="defaultSemiBold" style={{ color: "grey" }}>
                  Nothing found.
                </ThemedText>
              </>
            )}
          </View>
        )}
        numColumns={2}
        style={{paddingHorizontal:10}}
      />
    </ThemedView>
  );
}
