import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import CenterModal from "./CenterModal";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { AirbnbRating, Rating } from "react-native-ratings";
interface props {
  isVisible: any;
  onClose: any;
}
const ReviewModal = ({ isVisible, onClose }: props) => {
  const colorScheme = useColorScheme();
  const [reviewText, setReviewText] = useState("");
  const [productRating, setProductRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);

  return (
    <CenterModal isVisible={isVisible} onClose={onClose}>
      <ThemedText
        type="heading"
        style={{ textAlign: "left", paddingBottom: 20 }}
      >
        Write a Review
      </ThemedText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <ThemedText type="defaultSemiBold">Product</ThemedText>
        <AirbnbRating
          count={5}
          defaultRating={0}
          size={20}
          showRating={false}
          onFinishRating={setProductRating}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <ThemedText type="defaultSemiBold">Delivery</ThemedText>
        <AirbnbRating
          count={5}
          defaultRating={0}
          size={20}
          showRating={false}
          onFinishRating={setDeliveryRating}
        />
      </View>
      <TextInput
        multiline
        onChangeText={setReviewText}
        style={{
          height: 60,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          borderRadius: 10,
          width: "100%",
          paddingHorizontal: 10,
          paddingVertical: 5,
          backgroundColor: Colors[colorScheme ?? "light"].background2,
          color: Colors[colorScheme ?? "light"].text,
        }}
        placeholderTextColor={Colors[colorScheme ?? "light"].gray}
        placeholder="Write your review here"
      />
      <TouchableOpacity
        onPress={onClose}
        style={{
          backgroundColor: Colors.light.primary,
          padding: 12,
          borderRadius: 25,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          Submit
        </Text>
      </TouchableOpacity>
    </CenterModal>
  );
};

export default ReviewModal;

const styles = StyleSheet.create({});