import {
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import {  MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import {  useLocalSearchParams } from "expo-router";
import Header from "@/components/Header";
import { getSearchedProducts } from "@/utils/actions";
import ProductCard from "@/components/ProductCard";

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
    <View style={{ flex: 1, paddingTop: 35 }}>
      <Header title={name} />

      <FlatList
        data={products}
        keyExtractor={(item: any, index) => item._id + index}
        renderItem={({ item }) => <ProductCard item={item} />}
        ListEmptyComponent={() => (
          <View
            style={{
              height:height-60,
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
        contentContainerStyle={{
          columnGap: 15,
          rowGap: 12,
        }}
        style={{paddingHorizontal:10}}
      />
    </View>
  );
}
