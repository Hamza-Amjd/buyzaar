import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedText } from "@/components/ui/ThemedText";
import { getCollectionDetails } from "@/services/api/actions";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import ProductCard from "@/components/home/ProductCard";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import Header from "@/components/ui/Header";

const page = () => {
  const { id,image } = useLocalSearchParams<{ id: string,image:string
   }>();
  const [collectionDetails, setCollectionDetails] = useState<any>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      getCollectionDetails(id)
        .then((res) => setCollectionDetails(res))
        .finally(() => setLoading(false));
    })();
  }, []);
  return (
    <>
      <View style={styles.header}><Header/></View>
      
        <ParallaxScrollView
          headerImage={
            <Image
              source={{ uri: image }}
              style={styles.image}
            />
          }
        >
          {loading ? (
        <View style={styles.container}>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (<>
          <ThemedText style={styles.description}>
            {collectionDetails.description}
          </ThemedText>
          
          <FlatList
            data={collectionDetails.products}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <ProductCard item={item} />}
            numColumns={2}
            contentContainerStyle={{
              marginHorizontal: "auto",
              justifyContent: "space-evenly",
            }}
            scrollEnabled={false}
          />
          </>)}
        </ParallaxScrollView>
    </>
  );
};

export default page;

const styles = StyleSheet.create({
  container: {
    height: 500,
    alignItems: "center",
    justifyContent: "center"
  },
  header:{
    position: "absolute",
    top:10,
    zIndex:10
  },
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
