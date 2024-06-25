import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { clearCart } from "../redux/CartReducer";
import AnimatedLottieView from "lottie-react-native";
import SearchTile from "@/components/SearchTile";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
const confirmorder = () => {
  const colorScheme= useColorScheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAdress] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");
  //@ts-ignore
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  //@ts-ignore
  const totalPrice = cart?.map((item) => item.price * item.quantity).reduce((curr, prev) => curr + prev, 0);

  const handlePlaceOrder = async () => {
    const userId = await AsyncStorage.getItem("userId");
    axios
      .post("https://shopro-backend.vercel.app/api/shop/order", {
        userId: userId,
        cart: cart,
        totalPrice: totalPrice,
        shippingAddress: selectedAddress,
        paymentMethod: selectedPaymentOption,
      })
      .then((response) => {
        dispatch(clearCart());
        setTimeout(() => {
          router.replace("orders");
        }, 100);
      })
      .catch((error) => {
        console.log("failed to place order", error);
      });
  };

  const getAddress = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      router.replace("/(auth)");
      return;
    }
    await axios
      .get(`https://shopro-backend.vercel.app/api/shop/addresses/${userId}`)
      .then((response) => {
        if ((response.status = 200)) {
          setAddresses(response.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log("registration failed", error);
      });
  };
  useEffect(() => {
    getAddress();
  }, []);

  const steps = [
    { title: "Address", content: "Address Form" },
    { title: "Delivery", content: "Delivery Options" },
    { title: "Payment", content: "Payment Details" },
    { title: "Place Order", content: "Order Summary" },
  ];
  return (
    <ThemedView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }}>
      <View
        style={styles.stepsContainer}
      >
        {steps?.map((step, index) => (
          <View
            key={index}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            {index > 0 && (
              <View
                style={[
                  { flex: 1, height: 2, backgroundColor: "green" },
                  index <= currentStep && { backgroundColor: "green" },
                ]}
              />
            )}
            <TouchableOpacity
            disabled={index>currentStep}
              onPress={() => setCurrentStep(index)}
              style={[
                styles.steps,
                index == currentStep && {borderWidth:3,borderColor:'green',padding:2},
                index < currentStep && { backgroundColor: "green" },
              ]}
            >
              {index < currentStep ? (
                <Text
                  style={styles.stepstxt}
                >
                  &#10003;
                </Text>
              ) : (
                <Text
                  style={styles.stepstxt}
                >
                  {index + 1}
                </Text>
              )}
            </TouchableOpacity>
            <ThemedText type="defaultSemiBold" style={{ textAlign: "center", marginTop: 8 }}>
              {step.title}
            </ThemedText>
          </View>
        ))}
      </View>

      {currentStep == 0 && (loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <View style={styles.detailsContainer}>
          <View>
            <ThemedText type="heading">
              Select Delivery Address
            </ThemedText>

              {addresses.map((item:any, index) => (
                <TouchableOpacity key={item._id} style={[styles.itemContainer,{backgroundColor:Colors[colorScheme??'light'].background2}]} onPress={() => setSelectedAdress(item)}>
                  {selectedAddress && selectedAddress._id == item._id ? (
                    <FontAwesome5
                      name="dot-circle"
                      size={20}
                      color={Colors.light.primary}
                    />
                  ) : (
                    <Entypo
                      name="circle"
                      size={20}
                      color="gray"
                    />
                  )}

                  <View style={{ marginLeft: 6 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <ThemedText type="defaultSemiBold">
                        {item.name}
                      </ThemedText>
                      <Entypo name="location-pin" size={24} color="red" />
                    </View>

                    <ThemedText  type='default'>
                      {item.streetAddress +
                        ", " +
                        item.city +
                        ", " +
                        item.country}
                    </ThemedText>

                    <ThemedText  type='default'>
                      Contact : {item.mobileNo}
                    </ThemedText>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 7,
                      }}
                    >
                      <TouchableOpacity style={styles.subButton}>
                        <Text>Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.subButton}>
                        <Text>Remove</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.subButton}>
                        <Text>Set as Default</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
          <TouchableOpacity
            onPress={() => setCurrentStep(1)}
            style={[
              styles.button,
              !selectedAddress && {backgroundColor:Colors[colorScheme??'light'].gray}]}
            disabled={!selectedAddress}
          >
            <Text style={{ color: "white" }}>
              Deliver to this Address
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {currentStep == 1 && (
        <View style={styles.detailsContainer}>
          <View>
          <ThemedText type="heading">
              Choose your delivery options
            </ThemedText>

            <View style={styles.itemContainer}>
              <TouchableOpacity onPress={() => setDeliveryOption(!deliveryOption)}>{deliveryOption ? 
                <FontAwesome5
                  name="dot-circle"
                  size={20}
                  color={Colors.light.primary}
                />:
                <Entypo
                  name="circle"
                  size={20}
                  color="gray"
                />
              }
              </TouchableOpacity>

              <ThemedText style={{ flex: 1 }}>
                <Text style={{ color: "green", fontWeight: "500" }}>
                  Promtional Offer
                </Text>{" "}
                - FREE DELIVERY
              </ThemedText>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setCurrentStep(2)}
            style={[
              styles.button,
              !deliveryOption && {backgroundColor:Colors[colorScheme??'light'].gray}
            ]}
            disabled={!deliveryOption}
          >
            <Text style={{ color: "white" }}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentStep == 2 && (
        <View style={styles.detailsContainer}>
          <View>
          <ThemedText type="heading">
              Select your payment Method
            </ThemedText>

            <View style={styles.itemContainer}>
              {selectedPaymentOption === "cash on delivery" ? (
                <FontAwesome5
                  name="dot-circle"
                  size={20}
                  color={Colors.light.primary}
                />
              ) : (
                <Entypo
                  onPress={() => setSelectedPaymentOption("cash on delivery")}
                  name="circle"
                  size={20}
                  color="gray"
                />
              )}

              <ThemedText type="default">Cash on Delivery</ThemedText>
            </View>

            <View style={styles.itemContainer}>
              {selectedPaymentOption === "card" ? (
                <FontAwesome5
                  name="dot-circle"
                  size={20}
                  color={Colors.light.primary}
                />
              ) : (
                <Entypo
                  onPress={() => {
                    setSelectedPaymentOption("card payment");
                    Alert.alert("Credit/Debit card", "Pay Online", [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel is pressed"),
                      },
                      {
                        text: "OK",
                      },
                    ]);
                  }}
                  name="circle"
                  size={20}
                  color="gray"
                />
              )}

              <ThemedText type="default">Credit or debit card</ThemedText>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setCurrentStep(3)}
            style={[
              styles.button,
              !selectedPaymentOption && {backgroundColor:Colors[colorScheme??'light'].gray}
            ]}
            disabled={!selectedPaymentOption}
          >
            <Text style={{ color: "white" }}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentStep === 3 && selectedPaymentOption === "cash on delivery" && (
        <View style={styles.detailsContainer}>
          <View>
          <ThemedText type="heading">Order Now</ThemedText>

            <View
              style={[
                styles.itemContainer,
                { backgroundColor:Colors[colorScheme??'light'].background2, justifyContent: "space-between" },
              ]}
            >
              <View>
                <ThemedText style={{ fontSize: 17, fontWeight: "bold" }}>
                  Save 5% and never run out
                </ThemedText>
                <ThemedText style={{ fontSize: 15, color: "gray", marginTop: 5 }}>
                  Turn on auto deliveries
                </ThemedText>
              </View>

              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={Colors[colorScheme??'light'].text}
              />
            </View>

            <View
              style={[styles.itemListContainer,{backgroundColor:Colors[colorScheme??'light'].background2}]}
            >
              <ThemedText type="subtitle">Shipping to {selectedAddress.name}</ThemedText>

              <View style={styles.subItemContainer}>
                <ThemedText type="default"
                  style={{ color: "gray" }}
                >
                  Items
                </ThemedText>
                
                <ThemedText type="default" style={{ color: "gray", fontSize: 16 }}>
                  $ {totalPrice}{" "}
                </ThemedText>
              </View>
              <View >
                  {cart.map((item:any)=>{
                      return<SearchTile key={item._id} item={item}/>
                  })}
                </View>
                
              <View style={styles.subItemContainer}>
                <Text
                  style={{ fontSize: 16, fontWeight:'bold', color: "gray" }}
                >
                  Delivery
                </Text>

                <Text style={{ color: "gray", fontSize: 16 }}>$ 0</Text>
              </View>

              <View style={styles.subItemContainer}>
                <ThemedText style={{ fontSize: 20, fontWeight: "bold" }}>
                  Order Total
                </ThemedText>

                <Text
                  style={{ color: "#C60C30", fontSize: 17, fontWeight: "bold" }}
                >
                  $ {totalPrice}
                </Text>
              </View>
            </View>

            <View style={[styles.itemListContainer,{backgroundColor:Colors[colorScheme??'light'].background2,gap:2}]}
            >
              <ThemedText type="subtitle">Pay With</ThemedText>

              <ThemedText type="default">
                Pay on delivery (Cash)
              </ThemedText>
            </View>
          </View> 
          
          <TouchableOpacity
            onPress={() => {
              handlePlaceOrder();
              setCurrentStep(4);
            }}
            style={styles.button}
          >
            <Text style={{ color: "white" }}>Place your order</Text>
          </TouchableOpacity>
        </View>
      )}
      {currentStep === 4 && (
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
          <AnimatedLottieView
            autoPlay
            loop={false}
            style={{
              height: 300,
              width: 300,
            }}
            source={require("../assets/images/ordersuccess.json")}
          />
        </View>
      )}
    </ThemedView>
  );
};

export default confirmorder;

const styles = StyleSheet.create({
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  
  steps: {
    width: 40,
    height: 40,
    borderRadius: 150,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  stepstxt:{
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  detailsTitle:{
    fontSize: 20,
    fontWeight: "bold", 
    color:Colors.light.primary,
    paddingBottom: 10
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    marginBottom: 10,
  },
  disabledBtn:{
    color: Colors.light.white,
  },
  subButton: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 0.9,
    borderColor: "#D0D0D0",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 7,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 10,
    overflow:'hidden'
  },
  subItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  itemListContainer: {
    backgroundColor: "white",
    padding: 8,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 10,
  },
  
});
