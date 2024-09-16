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
import React, { useState, useEffect } from "react";
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Link, router } from "expo-router";
import { BottomModal, ModalContent, SlideAnimation } from "react-native-modals";
import Collections from "@/components/Collections";
import ProductCard from "@/components/ProductCard";
import useCart, { ProductType } from "@/hooks/useCart";
import AddressBottomModal from "@/components/AddressBottomModal";
import { getProducts } from "@/utils/actions";

export default function Home() {
  const colorScheme = useColorScheme();
  const [products, setProducts] = useState<any>([]);
  const [categoriesName, setCategoriesName] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [addresses, setAddresses] = useState<any>([]);
  const [selectedAddress, setSelectedAdress] = useState(addresses[0]);
  const [userId, setUserId] = useState("");
  const fetchProducts = async () => {
    setLoading(true);
    await getProducts().then((res)=>setProducts(res)).catch((err) =>console.log(err)).finally(()=>setLoading(false));
  };
  const loadMoreItems = () => {
    setCurrentPage(currentPage + 1);
  };
  const getAddress = async () => {
    const userId1: any = await AsyncStorage.getItem("userId");
    setUserId(userId1);
    if (userId1) {
      await axios
        .get(`https://buyzaar-backend.vercel.app/api/shop/addresses/${userId1}`)
        .then((response) => {
          if ((response.status = 200)) {
            setAddresses(response.data);
            setSelectedAdress(response.data[0]);
          }
        })
        .catch((error) => {
          console.log("fetching addresses failed", error.message);
        });
    }
  };

  const cart = useCart();

  useEffect(() => {
    fetchProducts();
    getAddress();
  }, []);
  useEffect(() => {
    // updateProducts();
  }, [currentPage]);
  const renderItem = ({ item }: { item: ProductType }) => {
    return <ProductCard item={item} />;
  };
  const categories = [
    {
      name: "men's clothing",
      icon: <Ionicons name="shirt-sharp" size={35} color="white" />,
    },
    {
      name: "men's clothing",
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
    if (!userId) {
      router.push("/(auth)");
    } else {
      router.push("/address");
    }
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
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
        >
          {selectedAddress &&
            selectedAddress.city + ", " + selectedAddress.country}
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

      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={Colors.dark.primary} />
        </View>
      ) : (
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
                data={products}
                keyExtractor={(item, index) => item._id + index}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ padding: 5 }}
              />
              <ThemedText type="title" style={{ paddingLeft: 10 }}>
                For you
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
            columnGap: 16,
            rowGap: 10,
          }}
          columnWrapperStyle={{ marginHorizontal: 10 }}
        />
      )}
      <AddressBottomModal
        isVisible={modalVisible}
        handleClose={() => setModalVisible(false)}
        addresses={addresses}
        handleAddAddress={handleAddAddress}
        selectedAddress={selectedAddress}
        setSelectedAdress={setSelectedAdress}
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
