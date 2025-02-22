import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  useColorScheme,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

type customButtonProps = TouchableOpacityProps&{
  isValid?: boolean;
  isOutlined?: boolean;
  isLoading?: boolean;
  title: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  height?: number;
  style?:any
};

const CustomButton = ({
  isValid=true,
  isOutlined=false,
  isLoading,
  title,
  icon,
  style,
  ...rest
}: customButtonProps) => {
  const colorScheme=useColorScheme()
  return (
    <TouchableOpacity
      style={[
        styles.Btn,style,
        isValid && { backgroundColor: Colors["light"].primary },
        isOutlined && { backgroundColor: Colors[colorScheme??"light"].background,borderColor: Colors["light"].primary, borderWidth: 3},
      ]}
      {...rest}
    >
      {icon?<Ionicons name={icon } size={20} color={'#fff'}/>:null}
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 18,
          color: isOutlined?Colors.primary:"white",
        }}
      >
        {isLoading ? <ActivityIndicator /> : title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  Btn: {
    height:45,
    borderRadius: 25,
    backgroundColor: Colors["dark"].gray,
    justifyContent: "center",
    alignItems: "center",
    flexDirection:'row',
    gap:5,
    elevation:5
  },
});
