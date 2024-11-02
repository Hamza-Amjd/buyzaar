import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  useColorScheme,
  StatusBar,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import Collections from "@/components/Collections";
import ProductCard from "@/components/ProductCard";
import useCart from "@/hooks/useCart";
import AddressBottomModal from "@/components/AddressBottomModal";
import { getCollectionDetails, getProducts } from "@/utils/actions";
import useLocation from "@/hooks/useLocation";
import CategoryList from "@/components/CategoryList";

export default function Home() {
  const colorScheme = useColorScheme();
  const { location, errorMsg } = useLocation();
  const cart = useCart();

  const [products, setProducts] = useState<any>();
  const [discountItems, setDiscountItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    await getCollectionDetails("66c0bf6a79a56dc5903581f5")
      .then((res) => setDiscountItems(res.products))
      .finally(() => setLoading(false));
    await getProducts()
      .then((res) => setProducts(res))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };
  const loadMoreItems = () => {
    setCurrentPage(currentPage + 1);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const renderItem = ({ item }: { item: ProductType }) => {
    return <ProductCard item={item} />;
  };

  return (
    <ThemedView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <Ionicons
            name={"location-sharp"}
            size={30}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
        <ThemedText
          type="mediumSemiBold"
          style={{ textTransform: "capitalize",fontSize:16 }}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
        >
          {location && location.district + ", " + location.city}
        </ThemedText>
        <TouchableOpacity
          onPress={() => {
            router.push("/cart");
          }}
        >
          <View style={{ alignItems: "flex-end" }}>
            <View style={styles.cartcount}>
              <Text style={styles.cartno}>{cart.cartItems.length}</Text>
            </View>

            <Ionicons
              name={"cart"}
              size={35}
              color={Colors[colorScheme ?? "light"].text}
            />
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item, index) => item._id + index}
        renderItem={renderItem}
        onRefresh={getProducts}
        refreshing={loading}
        ListHeaderComponent={
          <View>
            <Collections />
            <ThemedText
              type="title"
              style={{ paddingLeft: 10, paddingTop: 20, fontSize: 42 }}
            >
              Categories
            </ThemedText>
            <CategoryList />
            <ThemedText
              type="title"
              style={{ paddingLeft: 10, paddingTop: 10 }}
            >
              60%-OFF
            </ThemedText>
            <ThemedText type="default" style={{ paddingLeft: 10 }}>
              Limited time offer <AntDesign name="arrowright" size={15} />
            </ThemedText>
            <FlatList
              data={discountItems}
              keyExtractor={(item, index) => item._id + index}
              renderItem={renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ padding: 5 }}
            />
            <ThemedText type="title" style={{ paddingLeft: 10 }}>
              For you
            </ThemedText>
            <ThemedText type="default" style={{ paddingLeft: 10 }}>
              Selected products only for you{" "}
              <FontAwesome5 name="fire" size={15} />
            </ThemedText>
          </View>
        }
        onEndReached={loadMoreItems}
        ListFooterComponent={() => {
          return (
            footerLoading && (
              <ActivityIndicator
                size={"large"}
                style={{ alignSelf: "center" }}
              />
            )
          );
        }}
        numColumns={2}
        contentContainerStyle={{
          columnGap: 5,
        }}
        columnWrapperStyle={{ marginHorizontal: 10 }}
      />
      <AddressBottomModal
        isVisible={modalVisible}
        handleClose={() => setModalVisible(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartcount: {
    bottom: 16,
    width: 18,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "green",
    position: "absolute",
    zIndex: 999,
    justifyContent: "center",
  },
  cartno: {
    color: "white",
  },
});
