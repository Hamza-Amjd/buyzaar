import { ActivityIndicator, View } from "react-native";
import React from "react";

import { Colors } from "@/constants/Colors";

const Main = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size={"large"} color={Colors.light.primary} /> 
    </View>
  );
};

export default Main;
