import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

type customButtonProps = {
  onPress: () => void;
  isValid?: boolean;
  isLoading?: boolean;
  title: string;
  icon?:any;
};

const CustomButton = ({
  onPress,
  isValid=true,
  isLoading,
  title,
  icon,
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
      {icon?<Ionicons name={icon }/>:null}
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
    borderRadius: 16,
    backgroundColor: Colors["dark"].gray,
    justifyContent: "center",
    alignItems: "center",
    flexDirection:'row',
    elevation:5
  },
});
