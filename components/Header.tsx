import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

const Header = ({
  title,
  color='#fff',
  headerRight,
  onBackPress=()=>router.back()
}: {
  title?: string;
  color?: string;
  headerRight?: React.ReactNode;
  onBackPress?: ()=>void;
}) => {
  return (
    <View style={styles.bar}>
      <View style={{ flexDirection: "row", gap: 15 }}>
        <TouchableOpacity
          onPress={onBackPress}
        >
          <Ionicons name="arrow-back" size={30} color={color}/>
        </TouchableOpacity>
        {title && <Text style={[styles.title,{color}]}>{title}</Text>}
      </View>
      {headerRight && <View>{headerRight}</View>}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  bar: {
    padding: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
