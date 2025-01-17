import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type customiconButttonProps=TouchableOpacityProps & {
        onPress: () => void;
        iconName: string;
        size?: number;
        color?: string;
}
const CustomIconButton = ({ onPress, iconName,size=25,color ,...rest}:customiconButttonProps) => {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity onPress={onPress} {...rest}>
      <Ionicons
        name={iconName as any || "warning"}
        color={color?color:Colors[colorScheme ?? "light"].text}
        size={size}
      />
    </TouchableOpacity>
  );
};

export default CustomIconButton;

const styles = StyleSheet.create({});
