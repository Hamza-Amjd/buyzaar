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
import Coursel from "@/components/Coursel";
import Product from "@/components/Product";
import axios from "axios";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { BottomModal, ModalContent, SlideAnimation } from "react-native-modals";
export default function Home() {
  const colorScheme = useColorScheme();
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [addresses, setAddresses] = useState<any>([]);
  const [selectedAddress, setSelectedAdress] = useState(addresses[0]);
  const [userId, setUserId] = useState("");
  const getProducts = async () => {
    setLoading(true);
    await axios
      .get(`https://buyzaar-backend.vercel.app/api/admin/items?page=1&limit=8`)
      .then((response) => {
        if ((response.status = 200)) {
          setProducts(response.data.item);
        }
      })
      .catch((error) => {
        console.log("fetching products failed", error.message);
      });

    setLoading(false);
  };
  const updateProducts = async () => {
    setFooterLoading(true);
    await axios
      .get(
        `https://buyzaar-backend.vercel.app/api/admin/items?page=${currentPage}&limit=8`
      )
      .then((response) => {
        if ((response.status = 200)) {
          setProducts([...products, ...response.data.item]);
          setFooterLoading(false);
        }
      })
      .catch((error) => {
        console.log("fetching products failed", error.message);
      });
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
  //@ts-ignore

  const cart = useSelector((state) => state.cart.cart);
  useEffect(() => {
    getProducts();
    getAddress();
  }, []);
  useEffect(() => {
    updateProducts();
  }, [currentPage]);
  //@ts-ignore
  const renderItem = ({ item }) => {
    return <Product item={item} />;
  };
  const categories=[
    {"name":"men's clothing","icon":<Ionicons name="shirt-sharp" size={35} color="white" />,"label":"Men's"},
    {"name":"women's clothing","icon":<MaterialCommunityIcons name="tshirt-crew" size={35} color="white"/>,"label":"Women's"},
    {"name":"electronics","icon":<MaterialCommunityIcons name="power-plug" size={35} color="white"/>,"label":"Electronics"},
    {"name":"jewelery","icon":<MaterialCommunityIcons name="necklace" size={35} color="white" />,"label":"Jewelery"},
  ]
  return (
    <>
      <ThemedView style={{flex:1,paddingTop:StatusBar.currentHeight}}>
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
          <ThemedText type="defaultSemiBold" onPress={() => {
              setModalVisible(!modalVisible);
            }}>
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
                <Text style={styles.cartno}>{cart.length}</Text>
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
          <ActivityIndicator size={"large"} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item, index) => item._id + index}
            renderItem={renderItem}
            onRefresh={getProducts}
            refreshing={loading}
            ListHeaderComponent={
              <View>
                <Coursel />
                <ThemedText
                  type="title"
                  style={{ paddingLeft: 10, paddingTop: 20, fontSize: 42 }}
                >
                  Categories
                </ThemedText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.map((category,index) =>{
                    return<TouchableOpacity
                    key={index}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 5,
                    }}
                    onPress={() => {
                      router.push(`/category?category=${category.name}`);
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
                    <ThemedText type="default">{category.label}</ThemedText>
                  </TouchableOpacity>
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
            // @ts-ignore
            ListFooterComponent={
              footerLoading && (
                <ActivityIndicator
                  size={"large"}
                  style={{ alignSelf: "center" }}
                />
              )
            }
            numColumns={2}
            contentContainerStyle={{
              columnGap: 16,
              rowGap: 10,
            }}
            columnWrapperStyle={{ marginHorizontal: 10 }}
          />
        )}
      </ThemedView>
        <BottomModal
          //@ts-ignore
          onHardwareBackPress={() => setModalVisible(false)}
          visible={modalVisible}
          modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
          onTouchOutside={() => setModalVisible(false)}
          swipeDirection={["up", "down"]}
          swipeThreshold={200}
          onSwipeOut={() => setModalVisible(false)}
        >
          <ModalContent style={{ width: "100%", height: 300,backgroundColor:Colors[colorScheme??'light'].background }}>
            <View style={{ marginBottom: 8 }}>
              <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
                Choose your Location
              </ThemedText>

              <Text style={{ marginTop: 5, fontSize: 16, color: "gray" }}>
                Select a delivery location to see product availabilty and delivery
                options
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* @ts-ignore */}              
              {addresses.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedAdress(item)}
                  style={[styles.addressContainer,{backgroundColor:selectedAddress === item ? "#FBCEB1" : "white"}]}
                >
                  <View
                    style={styles.row}
                  >
                    <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                      {item.name}
                    </Text>
                    <Entypo name="location-pin" size={24} color="red" />
                  </View>

                  <Text
                    numberOfLines={1}
                    style={{ width: 130, fontSize: 13, textAlign: "center" }}
                  >
                    {item.streetAddress}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{ width: 130, fontSize: 13, textAlign: "center" }}
                  >
                    {item.city}, {item.country}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  if (!userId) {
                    router.push("/(auth)");
                  } else {
                    router.push('/address');
                  }
                }}
                style={styles.addAddressContainer}
              >
                <Text
                  style={styles.addAddressTxt}
                >
                  Add an Address or pick-up point
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </ModalContent>
        </BottomModal>
    </>
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
  addressContainer: {
    width: 140,
                    height: 140,
                    borderColor: "#D0D0D0",
                    borderWidth: 1,
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 3,
                    marginRight: 15,
                    marginTop: 10,
                    borderRadius: 10,
  },
  row:{ flexDirection: "row", alignItems: "center", gap: 3 },
  addAddressContainer:{
    width: 140,
    height: 140,
    borderColor: "#D0D0D0",
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  addAddressTxt:{
    textAlign: "center",
    color: "#0066b2",
    fontWeight: "500",
  }
});
