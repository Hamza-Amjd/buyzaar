import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useColorScheme,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import AnimatedLottieView from "lottie-react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const favorities = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const favorite = useSelector((state: any) => state.favorite.favorite);
  useEffect(() => {
    setProducts(favorite);
  }, []);
  const colorScheme = useColorScheme();
  return (
    <ThemedView style={{flex:1, paddingTop:35}}>
      <View style={styles.bar}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons
            name="arrow-back"
            size={35}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
        <ThemedText
          type="subtitle"
          style={{
            margin: 10,
          }}
        >
          {"  "}Favoraties
        </ThemedText>
      </View>
      {favorite.length == 0 && (
        <AnimatedLottieView
          autoPlay
          loop
          speed={0.3}
          style={{ height: 150, width: 150, alignSelf: "center" ,top:250 }}
          source={require("../assets/images/emptyCart.json")}
        />
      )}
      <FlatList
        data={products}
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
export default favorities;
const styles = StyleSheet.create({
  bar: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
