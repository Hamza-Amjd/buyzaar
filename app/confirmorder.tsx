import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  useColorScheme,
  BackHandler,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { clearCart } from "../redux/CartReducer";
import AnimatedLottieView from "lottie-react-native";
import SearchTile from "@/components/SearchTile";
import { router, useFocusEffect } from "expo-router";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Step1 from "@/components/ConfirmOrder/Step1";
import Step2 from "@/components/ConfirmOrder/Step2";
import Step3 from "@/components/ConfirmOrder/Step3";
import Step4 from "@/components/ConfirmOrder/Step4";
const confirmorder = () => {
  const colorScheme = useColorScheme();
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

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if(currentStep === 0){
          router.back();
          return;
        }
        if (currentStep < 4) {
          setCurrentStep((prev) => prev - 1);
        }
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [currentStep])
  );
  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };
  const handlePlaceOrder = async () => {
    const userId = await AsyncStorage.getItem("userId");
    axios
      .post(`https://buyzaar-backend.vercel.app/api/shop/order`, {
        userId: userId,
        cart: cart,
        totalPrice: totalPrice,
        shippingAddress: selectedAddress,
        paymentMethod: selectedPaymentOption,
      })
      .then((response) => {
        console.log(response.data)
        dispatch(clearCart());
        setTimeout(() => {
          router.replace("/orders");
        }, 100);
      })
      .catch((error) => {
        console.log("failed to place order", error);
      });
    handleNext();
  };

  const getAddress = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      router.replace("/(auth)");
      return;
    }
    await axios
      .get(`https://buyzaar-backend.vercel.app/api/shop/addresses/${userId}`)
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
    <ThemedView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 60 }}>
      <View style={styles.stepsContainer}>
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
              disabled={index > currentStep}
              onPress={() => setCurrentStep(index)}
              style={[
                styles.steps,
                index == currentStep && {
                  borderWidth: 3,
                  borderColor: "green",
                  padding: 2,
                },
                index < currentStep && { backgroundColor: "green" },
              ]}
            >
              {index < currentStep ? (
                <Text style={styles.stepstxt}>&#10003;</Text>
              ) : (
                <Text style={styles.stepstxt}>{index + 1}</Text>
              )}
            </TouchableOpacity>
            <ThemedText
              type="defaultSemiBold"
              style={{ textAlign: "center", marginTop: 8 }}
            >
              {step.title}
            </ThemedText>
          </View>
        ))}
      </View>

      {currentStep == 0 &&
        (loading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size={"large"} />
          </View>
        ) : (
          <Step1
            addresses={addresses}
            setSelectedAdress={setSelectedAdress}
            handleNext={handleNext}
            selectedAddress={selectedAddress}
            styles={styles}
          />
        ))}

      {currentStep == 1 && (
        <Step2
          deliveryOption={deliveryOption}
          setDeliveryOption={setDeliveryOption}
          styles={styles}
          handleNext={handleNext}
        />
      )}

      {currentStep == 2 && (
        <Step3
          selectedPaymentOption={selectedPaymentOption}
          setSelectedPaymentOption={setSelectedPaymentOption}
          styles={styles}
          handleNext={handleNext}
        />
      )}

      {currentStep === 3 && selectedPaymentOption === "cash on delivery" && (
        <Step4
          handleSubmit={handlePlaceOrder}
          styles={styles}
          cart={cart}
          selectedAddress={selectedAddress}
          totalPrice={totalPrice}
        />
      )}
      {currentStep === 4 && (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
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
  stepstxt: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.primary,
    paddingBottom: 10,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    marginBottom: 10,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  disabledBtn: {
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
    overflow: "hidden",
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
