import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  useColorScheme,
  Alert,
  ToastAndroid,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AnimatedLottieView from "lottie-react-native";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Link, router } from "expo-router";
import { numberWithCommas } from "@/utils/healper";
import Header from "@/components/Header";
import useCart, { CartItem } from "@/hooks/useCart";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import { useStripe } from "@stripe/stripe-react-native";
import AddressBottomModal from "@/components/AddressBottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useDefaultAddress } from "@/hooks/useDefaultAddress";

export default function cart() {
  const colorScheme = useColorScheme();
  const { defaultAddress } = useDefaultAddress();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<any>(defaultAddress);

  const { user } = useUser();
  const cartHook = useCart();
  const subtotal = cartHook.cartItems.reduce(
    (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
    0
  );
  const total = subtotal + 300;
  const customerInfo = {
    clerkId: user?.id,
    email: user?.emailAddresses[0].emailAddress,
    name: user?.firstName + " " + user?.lastName,
  };
  const fetchPaymentSheetParams = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to proceed with checkout.");
      return;
    }
    const response = await fetch(
      `https://buyzaar-admin.vercel.app/api/mobile/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          address,
        }),
      }
    );
    const { paymentIntent} = await response.json();
    return {
      paymentIntent
    };
  };

  const initializePaymentSheet = async () => {
    //@ts-ignore
    const { paymentIntent } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: user?.fullName!,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {address:{country:'PK'}},
      
    });
    if (!error) {
      setLoading(true);
    }
  };
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      ToastAndroid.showWithGravity(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    } else {
      
      await axios
        .post(`https://buyzaar-admin.vercel.app/api/mobile/createorder`, {
          cartItems: cartHook.cartItems,
          customerInfo,
          total,
          address:{
            name: customerInfo.name,
            address:{line1: address.address,
            line2: "",
            city: address.city,
            state:"",
            postalCode: "",
            country: address.country},
            phone:address.phoneNumber
          },
        })
        .then(() => cartHook.clearCart())
        .catch((error) =>{
          Alert.alert(
            `Error code: ${error.code}`,
            "Some error occurred while creating order your payment will be returned"
          );console.log(error);}
        );
      Alert.alert("Success", "Your order is confirmed!");
    }
  };
  const handleClearCart = () => {
    Alert.alert("Clear Cart", "Are you sure you want to clear the cart?", [
      { text: "Cancel", onPress: () => {} },
      { text: "Confirm", onPress: () => {cartHook.clearCart();ToastAndroid.showWithGravity(
        "Cart cleared successfully",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );} },
    ]);
  };
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const handlePresentAddressModalPress = React.useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  
  const renderItem = ({ item }: { item: CartItem }) => {
    return (
      <Link
        href={`/products/${item.item._id}`}
        asChild
        style={[
          styles.productContainer,
          {
            backgroundColor: Colors[colorScheme ?? "light"].background2,
          },
        ]}
      >
        <TouchableOpacity>
          <View style={styles.imgContainer}>
            <Image
              style={styles.imgContainer}
              source={{ uri: item.item.media[0] }}
            />
          </View>
          <View>
            <ThemedText type="defaultSemiBold">
              {item.item.title.length > 28
                ? `${item.item.title.slice(0, 28)}...`
                : item.item.title}
            </ThemedText>
            {item?.color && (
              <ThemedText type="default">
                Color: {item.color.toUpperCase()}
              </ThemedText>
            )}
            {item?.size && (
              <ThemedText type="default">
                Varient: {item.size.toUpperCase()}
              </ThemedText>
            )}
            <ThemedText
              type="mediumSemiBold"
              style={{ color: Colors.light.tertiary }}
            >
              <Text style={{ fontSize: 16 }}>Rs. </Text>
              {numberWithCommas(item?.item?.price)}
            </ThemedText>
            <View style={styles.quantityRow}>
              {item.quantity !== 1 ? (
                <TouchableOpacity
                  onPress={() => cartHook.decreaseQuantity(item.item._id)}
                >
                  <Feather
                    name="minus"
                    size={23}
                    color="white"
                    style={{
                      borderTopLeftRadius: 3,
                      borderBottomLeftRadius: 5,
                      backgroundColor: Colors.light.primary,
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => cartHook.removeItem(item.item._id)}
                >
                  <MaterialCommunityIcons
                    name="delete"
                    size={20}
                    color="white"
                    style={{
                      backgroundColor: Colors.light.primary,
                      borderTopLeftRadius: 3,
                      borderBottomLeftRadius: 3,
                      padding: 2,
                    }}
                  />
                </TouchableOpacity>
              )}

              <ThemedText
                style={{
                  fontSize: 16,
                  borderTopWidth: 0.8,
                  borderColor: Colors.light.primary,
                  borderBottomWidth: 0.8,
                  paddingHorizontal: 10,
                  lineHeight: 22,
                }}
              >
                {item.quantity}
              </ThemedText>
              <TouchableOpacity
                onPress={() => cartHook.increaseQuantity(item.item._id)}
              >
                <Feather
                  name="plus"
                  size={23}
                  color="white"
                  style={{
                    borderTopRightRadius: 3,
                    borderBottomRightRadius: 3,
                    backgroundColor: Colors.light.primary,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };
  return (
    <>
      <ThemedView style={styles.container}>
        <Header
          title="Cart"
          headerRight={
            <TouchableOpacity onPress={handleClearCart}>
              <Ionicons
                name="trash-bin"
                color={Colors[colorScheme ?? "light"].text}
                size={25}
              />
            </TouchableOpacity>
          }
        />
        <View style={{ flex: 1 }}>
          {cartHook.cartItems.length == 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AnimatedLottieView
                autoPlay
                loop
                speed={0.3}
                style={{ height: 150, width: 150 }}
                source={require("../assets/images/emptyCart.json")}
              />
            </View>
          ) : (
            <FlatList
              data={cartHook.cartItems}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.item._id}
              renderItem={renderItem}
              ListFooterComponent={() => (
                <>
                  <View style={styles.titleRow}>
                    <ThemedText style={styles.textlight}>SubTotal :</ThemedText>
                    <ThemedText style={styles.textlight}>
                      Rs. {numberWithCommas(subtotal)}
                    </ThemedText>
                  </View>
                  <View style={styles.titleRow}>
                    <ThemedText style={styles.textlight}>Delivery :</ThemedText>
                    <ThemedText style={styles.textlight}>Rs. 300</ThemedText>
                  </View>
                  <View style={styles.titleRow}>
                    <ThemedText type="defaultSemiBold">Total :</ThemedText>
                    <ThemedText
                      type="subtitle"
                      style={{ color: Colors.light.tertiary }}
                    >
                      <Text style={{ fontSize: 14 }}>Rs. </Text>
                      {numberWithCommas(total)}
                    </ThemedText>
                  </View>
                </>
              )}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={async () => {
            if(!user){
              router.replace("/(auth)")
            }
            if(!defaultAddress){
            handlePresentAddressModalPress();
            await initializePaymentSheet()
          }else{
            await initializePaymentSheet().then(async()=>await openPaymentSheet());
          }
          }}
          disabled={subtotal == 0}
          style={[styles.buyRow,{backgroundColor: subtotal == 0?Colors.light.gray:Colors.light.primary  }]}
        >
          <MaterialCommunityIcons
            name="cart-arrow-right"
            size={24}
            color={"#fff"}
          />
          <Text
            style={styles.cheakoutBtn}
          >
            C H E A K O U T
          </Text>
        </TouchableOpacity>
      </ThemedView>
      <AddressBottomModal bottomSheetModalRef={bottomSheetModalRef}/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  productContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 15,
    marginHorizontal: 10,
    padding: 5,
    marginVertical: 10,
    elevation: 5,
    overflow: "hidden",
  },
  imgContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: "contain",
    backgroundColor: "#FFFFFF",
    marginRight: 10,
  },
  titleRow: {
    marginTop: 10,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textlight: {
    color: "grey",
    fontSize: 14,
  },
  quantityRow: {
    flexDirection: "row",
    marginVertical: 5,
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    paddingRight: 10,
  },
  buyRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    padding: 10,
    width: "95%",
    alignSelf: "center",
    marginBottom: 10,
  },
  cheakoutBtn:{
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff" ,
  }
});
