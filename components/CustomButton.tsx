import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

type customButtonProps = {
  onPress: () => void;
  isValid?: boolean;
  isLoading?: boolean;
  title: string;
};

const CustomButton = ({
  onPress,
  isValid=true,
  isLoading,
  title,
}: customButtonProps) => {
  return (
    <TouchableOpacity
      disabled={!isValid}
      onPress={onPress}
      style={[
        styles.registerBtn,
        isValid && { backgroundColor: Colors["light"].primary },
      ]}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 16,
          color: "white",
        }}
      >
        {isLoading ? <ActivityIndicator /> : title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  registerBtn: {
    height: 50,
    borderRadius: 20,
    backgroundColor: Colors["light"].gray,
    justifyContent: "center",
    alignItems: "center",
    elevation:5
  },
});
