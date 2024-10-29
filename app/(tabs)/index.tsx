import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  useColorScheme,
  StatusBar,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import {
  AntDesign,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Link, Redirect, router } from "expo-router";
import Collections from "@/components/Collections";
import ProductCard from "@/components/ProductCard";
import useCart from "@/hooks/useCart";
import AddressBottomModal from "@/components/AddressBottomModal";
import { getCollectionDetails, getProducts } from "@/utils/actions";
import useLocation from "@/hooks/useLocation";

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
  const [addresses, setAddresses] = useState<any>([]);
  const [selectedAddress, setSelectedAdress] = useState(addresses[0]);

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
  const categories = [
    {
      name: "men's clothing",
      icon: <Ionicons name="shirt-sharp" size={35} color="white" />,
    },
    {
      name: "women's clothing",
      icon: (
        <MaterialCommunityIcons name="tshirt-crew" size={35} color="white" />
      ),
    },
    {
      name: "electronics",
      icon: (
        <MaterialCommunityIcons name="power-plug" size={35} color="white" />
      ),
    },
    {
      name: "jewelery",
      icon: <MaterialCommunityIcons name="necklace" size={35} color="white" />,
    },
  ];
  const handleAddAddress = () => {
    setModalVisible(false);
    router.push("/addAddress");
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
          type="defaultSemiBold"
          style={{ textTransform: "capitalize" }}
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((category, index) => {
                return (
                  <Link
                    href={`/category?name=${category.name}`}
                    key={index}
                    asChild
                  >
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 5,
                      }}
                    >
                      <View
                        style={[
                          styles.category,
                          {
                            backgroundColor:
                              Colors[colorScheme ?? "light"].primary,
                          },
                        ]}
                      >
                        {category.icon}
                      </View>
                      <ThemedText
                        type="default"
                        style={{ textTransform: "capitalize" }}
                      >
                        {category.name.replace(/ .*/, "")}
                      </ThemedText>
                    </TouchableOpacity>
                  </Link>
                );
              })}
            </ScrollView>

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
          rowGap: 5,
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
  categorytxt: {
    fontSize: 32,
    fontWeight: "bold",
    paddingHorizontal: 7,
  },
  category: {
    borderWidth: 1,
    borderRadius: 50,
    padding: 7,
    margin: 5,
    marginVertical: 10,
  },
});
