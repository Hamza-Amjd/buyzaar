import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  ToastAndroid,
  FlatList,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ui/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import {  numberWithCommas } from "@/utils/healper";
import Header from "@/components/ui/Header";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import useCartStore from "@/services/cartStore";
import { useStripe } from "@stripe/stripe-react-native";
import { useAddressStore } from "@/services/addressStore";
import AddressBottomModal from "@/components/modals/AddressBottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import EmptyListView from "@/components/ui/EmptyListView";
import CustomIconButton from "@/components/ui/CustomIconButton";
import CustomButton from "@/components/ui/CustomButton";
import CartItemCard from "@/components/cart/CartItemCard";

export default function Page() {
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();


  const{ defaultAddress,setDefaultAddress}=useAddressStore();

  const { user } = useUser();
  const cart = useCartStore();
  const subtotal = cart.cartItems.reduce(
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
          cartItems: cart.cartItems,
          customerInfo,
          total,
          address:{
            name: customerInfo.name,
            address:{
              line1: defaultAddress?.address,
            line2: "",
            city: defaultAddress?.city,
            state:"",
            postalCode: "",
            country: defaultAddress?.country},
            phone:defaultAddress?.phoneNumber
          },
        })
        .then(() => cart.clearCart())
        .catch((error) =>{
          Alert.alert(
            `Error code: ${error.code}`,
            "Some error occurred while creating order your payment will be returned"
          );console.log(error);}
        );
      Alert.alert("Success", "Your order is confirmed!");
    }
  };
  const handleCheckout=async() => {
    if(!defaultAddress){
      bottomSheetModalRef.current?.present();
    }else{
      await initializePaymentSheet().then(async()=> await openPaymentSheet())  
    }
  }
  const handleClearCart = () => {
      Alert.alert("Clear Cart", "Are you sure you want to clear the cart?", [
        { text: "Cancel", onPress: () => {} },
        { text: "Confirm", onPress: () => {cart.clearCart();ToastAndroid.showWithGravity(
          "Cart cleared successfully",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );} },
      ]);
    };

  
  
  return (
    <ThemedView style={styles.container}>
        <Header
          title="Cart"
          headerRight={<CustomIconButton onPress={handleClearCart} iconName="trash-bin"/>}
        />
        <View style={{ flex: 1 }}>
          {cart.cartItems.length == 0 ? (
            <EmptyListView/>
          ) : (
            <FlatList
              data={cart.cartItems}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.item._id}
              renderItem={({item})=><CartItemCard item={item}/>}
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
          <CustomButton title="C H E A K O U T" icon={"cart"}  onPress={handleCheckout} isValid={subtotal !== 0} style={{margin:10}}/>
      <AddressBottomModal bottomSheetModalRef={bottomSheetModalRef} setAddress={setDefaultAddress} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
