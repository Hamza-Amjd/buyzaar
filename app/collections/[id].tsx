import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { getCollectionDetails } from "@/utils/actions";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import ProductCard from "@/components/ProductCard";
import ParallaxScrollView from "@/components/ParallaxScrollView";

const page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [collectionDetails, setCollectionDetails] = useState<any>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getCollectionDetails(id)
      .then((res) => setCollectionDetails(res))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      {loading ? (
        <View style={styles.container}>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <ParallaxScrollView
          headerImage={
            <Image
              source={{ uri: collectionDetails.image }}
              style={styles.image}
            />
          }
        >
          <ThemedText style={styles.description}>
            {collectionDetails.description}
          </ThemedText>
          <FlatList
            data={collectionDetails.products}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <ProductCard item={item} />}
            numColumns={2}
            contentContainerStyle={{ marginHorizontal:'auto',justifyContent:'space-evenly'}}
            scrollEnabled={false}
          />
        </ParallaxScrollView>
      )}
    </>
  );
};

export default page;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  description: {
    textAlign: "center",
    fontSize: 18,
    color: "grey",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
