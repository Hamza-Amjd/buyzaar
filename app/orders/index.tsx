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
import { Link, router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ReviewModal from "@/components/ReviewModal";
import Header from "@/components/Header";
import { getOrders } from "@/utils/actions";
import { numberWithCommas } from "@/utils/healper";
import { useUser } from "@clerk/clerk-expo";

const OrdersScreen = () => {
  const colorScheme = useColorScheme();
  const {user} = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setloading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const fetchOrders = async () => {
    if (!user) {
      router.replace("/(auth)");
      return;
    }
    await getOrders(user.id)
      .then((res) => setOrders(res))
      .finally(() => setloading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderItem = ({ item }: { item: OrderType }) => {
    return (
      <View
        style={[styles.itemContainer,{backgroundColor: Colors[colorScheme ?? "light"].background2}]}
        key={item._id}
      >
        <View>
          <View
            style={[styles.titleRow,{borderBottomColor: Colors[colorScheme ?? "light"].text}]}
          >
            <ThemedText type="defaultSemiBold">Awaitng delivey</ThemedText>
            <ThemedText type="defaultSemiBold">
              {new Date(item.createdAt).toDateString()}
            </ThemedText>
          </View>
          <ThemedText type="default">
            {/* @ts-ignore */}
            {`Deliver to "${item.shippingAddress.name}" at "${item.shippingAddress?.line1}, ${item.shippingAddress?.line2.length>0?item.shippingAddress?.line2+", ":""}${item.shippingAddress?.city}, ${item.shippingAddress?.country}"`}
          </ThemedText>
          <ThemedText type="default">
            {/* @ts-ignore */}
            {`Phone no. ${item.shippingAddress?.phone}`}
          </ThemedText>
          <ThemedText
            type="defaultSemiBold"
            style={{ color: Colors.light.tertiary }}
          >
            Total amount : Rs {numberWithCommas(item.totalAmount)}
          </ThemedText>
        </View>
        {item.products.map((product: OrderItemType) => {
          return (
            <Link href={`/products/${product.product._id}`} style={[styles.productContainer,{backgroundColor: Colors[colorScheme ?? "light"].background3}]} key={product._id}>
              <View style={[{flexDirection:"row",gap:5}]}
              >
                <Image
                  style={styles.imgContainer}
                  source={{ uri: product.product.media[0] }}
                />
                <View style={{ gap: 5 }}>
                  <ThemedText type="defaultSemiBold">
                    {product.product.title.length > 27
                      ? product.product.title.slice(0, 27) + "..."
                      : product.product.title}
                  </ThemedText>
                  <ThemedText
                    type="default"
                    style={{ textTransform: "capitalize" }}
                  >
                    Color : {product.color}
                  </ThemedText>
                  <ThemedText type="default">
                    Price : Rs {numberWithCommas(product.product.price)} x{" "}
                    {product.quantity}
                  </ThemedText>
                </View>
              </View>
            </Link>
          );
        })}
        <ThemedText>
          All Orders will be shipped in 2-6 working days after placing order
        </ThemedText>
        <View style={{flexDirection:'row',gap:10,alignSelf:'flex-end'}}>
        <TouchableOpacity
          onPress={() => router.push('/orders/10023')}
          style={{padding: 8,borderRadius: 20,backgroundColor: Colors[colorScheme ?? "light"].primary}}
        >
          <Text style={{ color: "white", fontSize: 12 }}>Track Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowRatingModal(true)}
          style={{padding: 8,borderRadius: 20,backgroundColor: Colors[colorScheme ?? "light"].primary}}
        >
          <Text style={{ color: "white", fontSize: 12 }}>Write Review</Text>
        </TouchableOpacity></View>
      </View>
    );
  };

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
          source={require("@/assets/images/emptyCart.json")}
        />
      ) : (
        <FlatList
          data={orders}
          onRefresh={fetchOrders}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
      <ReviewModal
        isVisible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  itemContainer:{
    padding: 8,
    borderRadius: 10,
    marginBottom: 15,
  },
  titleRow:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    marginBottom: 10,
  },
  productContainer: {
      alignItems: "center",
      padding: 8,
      borderRadius: 5,
      marginBottom: 10,
  },
  imgContainer: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    borderRadius: 7,
  },
});
export default OrdersScreen;
