import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Link, router } from "expo-router";
import { ThemedText } from "./ThemedText";
import { numberWithCommas } from "@/utils/healper";
import WishlistButton from "./WishlistButton";
type productProps = {
  item: any;
};

const { width: screenWidth } = Dimensions.get('window');
const cardMargin = 10;
const cardsPerRow = 2;
const cardWidth = (screenWidth - cardMargin * (cardsPerRow + 1)) / cardsPerRow;

const ProductCard: React.FC<productProps> = ({ item }) => {
  const { title, media, price, rating } = item;
  const colorScheme = useColorScheme();
  return (
    <Link
      href={`/products/${item._id}?image=${item.media[0]}`}
      asChild
      style={[
        styles.productContainer,
        { width: cardWidth },
      ]}
    >
      <TouchableOpacity>
        <View
          style={[
            styles.imgContainer,
            { backgroundColor: "white" },
          ]}
        >
          <View style={styles.fav}>
            <WishlistButton product={item} />
          </View>
          <Image style={styles.img} source={{ uri: media[0] }} />
          {rating && (
            <View
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                backgroundColor: Colors.light.gray,
                padding: 5,
                borderTopLeftRadius: 10,
              }}
            >
              <Text style={{ color: "gold", fontSize: 12, fontWeight: "bold" }}>
                <Ionicons name="star" size={10} /> {rating.rate}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.price}>
          <Text style={{ fontSize: 14 }}>Rs. </Text>
          {numberWithCommas(price)}
        </Text>
        <ThemedText type="default" style={{ left: 7, width: "98%" }}>
          {title.length > 40 ? title.slice(0, 38) + "..." : title}
        </ThemedText>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    height: cardWidth * 1.3,
    overflow: "hidden",
    margin: cardMargin / 2,
  },
  imgContainer: {
    width: cardWidth - 10,
    height: cardWidth-10,
    overflow: "hidden",
    borderRadius: 10,
  },
  img: {
    aspectRatio: 1,
    resizeMode: "contain",
  },
  fav: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 999,
  },
  price: {
    marginRight: 7,
    fontWeight: "semibold",
    fontSize: 16,
    color: "tomato",
    alignSelf: "flex-end",
  },
});

export default ProductCard;
