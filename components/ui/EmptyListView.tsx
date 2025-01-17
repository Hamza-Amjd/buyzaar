import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AnimatedLottieView from "lottie-react-native";

const EmptyListView = ({style}:{style?:any}) => {
  return (
    <View style={[styles.container,style]}>
      <AnimatedLottieView
        autoPlay
        loop
        speed={0.3}
        style={{ height: 150, width: 150 }}
        source={require("@/assets/images/emptyCart.json")}
      />
    </View>
  );
};

export default EmptyListView;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }
});
