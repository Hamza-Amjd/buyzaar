import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import AnimatedLottieView from "lottie-react-native";
import SearchTile from "../components/SearchTile";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ReviewModal from "@/components/ReviewModal";
import Header from "@/components/Header";
import { getOrders } from "@/utils/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { numberWithCommas } from "@/utils/healper";

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setloading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const fetchOrders = async () => {
    let userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      router.replace("/(auth)");
      return;
    }
    await getOrders(userId)
      .then((res) => setOrders(res))
      .finally(() => setloading(false));
  };

  useEffect(() => {
    fetchOrders()
  }, []);

  const colorScheme = useColorScheme();

  return (
    <ThemedView style={{ flex: 1, paddingTop: 35, paddingHorizontal: 10 }}>
      <Header
        title="Orders"
        onBackPress={() => router.replace("/(tabs)/profile")}
      />
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      ) : orders.length == 0 ? (
        <AnimatedLottieView
          autoPlay
          loop
          speed={0.3}
          style={{ height: 150, width: 150, alignSelf: "center", top: "30%" }}
          source={require("../assets/images/emptyCart.json")}
        />
      ) : (
        orders.map((order: OrderType) => {
          return (
            <View
              style={{
                backgroundColor: Colors[colorScheme ?? "light"].background2,
                padding: 8,
                borderRadius: 10,
                marginBottom: 15,
              }}
              key={order._id}
            >
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottomWidth: 0.5,
                    borderBottomColor: Colors[colorScheme ?? "light"].text,
                    marginBottom: 10,
                  }}
                >
                  <ThemedText type="defaultSemiBold">
                    Awaitng delivey
                  </ThemedText>
                  <ThemedText type="defaultSemiBold">
                    {new Date(order.createdAt).toDateString()}
                  </ThemedText>
                </View>

                <ThemedText type="default">
                  {/* @ts-ignore */}
                  {`Deliver at ${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.country}`}
                </ThemedText>
                <ThemedText type="default">Phone no. : ********969</ThemedText>
                <ThemedText
                  type="defaultSemiBold"
                  style={{ color: Colors.light.tertiary }}
                >
                  Total amount : Rs {numberWithCommas(order.totalAmount)}
                </ThemedText>
              </View>
              {order.products.map((product: OrderItemType) => {
                return (
                  <View
                    key={product._id}
                    style={{
                      backgroundColor:
                        Colors[colorScheme ?? "light"].background3,
                      flexDirection: "row",
                      alignItems: "center",
                      padding:8,
                      borderRadius:5,
                      marginBottom:10,
                      gap:5
                    }}
                  >
                    <Image
                      style={styles.imgContainer}
                      source={{ uri: product.product.media[0] }}
                    />
                    <View style={{gap:5}}>
                      <ThemedText type="defaultSemiBold">{product.product.title.length>30?product.product.title.slice(0,30)+"...":product.product.title}</ThemedText>
                      <ThemedText type="default" style={{textTransform:'capitalize'}}>
                        Color : {product.color}
                      </ThemedText>
                      <ThemedText type="default">
                        Price : Rs {numberWithCommas(product.product.price)} x {product.quantity}
                      </ThemedText>
                    </View>
                  </View>
                );
              })}
              <ThemedText>
                All Orders will be shipped in 2-6 working days after placing
                order
              </ThemedText>
              <TouchableOpacity
                onPress={() => setShowRatingModal(true)}
                style={{
                  alignSelf: "flex-end",
                  padding: 8,
                  backgroundColor: Colors[colorScheme ?? "light"].primary,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: "white", fontSize: 12 }}>
                  Write Review
                </Text>
              </TouchableOpacity>
            </View>
          );
        })
      )}
      <ReviewModal
        isVisible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  productContainer:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imgContainer: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    backgroundColor: "#fff",
    borderRadius: 7,
  },
});
export default OrdersScreen;
