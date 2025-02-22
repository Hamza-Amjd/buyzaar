import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import useCartStore, { CartItem } from "@/services/cartStore";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../ui/ThemedText";
import { numberWithCommas } from "@/utils/healper";
import CustomIconButton from "../ui/CustomIconButton";

const CartItemCard = ({ item }: { item: CartItem }) => {
  const colorScheme = useColorScheme();
  const cart = useCartStore();
  return (
      <TouchableOpacity onPress={()=>router.navigate({pathname:"/(screens)/productdetails",params:item.item})} style={[
        styles.productContainer,
        { backgroundColor: Colors[colorScheme ?? "light"].background2 },
      ]}>
        <Image
          style={styles.imgContainer}
          source={{ uri: item.item.media[0] }}
        />
        <View>
          <ThemedText type="defaultSemiBold">
            {item.item.title.length > 28
              ? `${item.item.title.slice(0, 28)}...`
              : item.item.title}
          </ThemedText>
          {item?.color && (
            <ThemedText >
              Color: {item.color.toUpperCase()}
            </ThemedText>
          )}
          {item?.size && (
            <ThemedText >
              Varient: {item.size.toUpperCase()}
            </ThemedText>
          )}
          <ThemedText
            type="mediumSemiBold"
            style={{ color: Colors.light.tertiary }}
          >
            <Text style={{ fontSize: 16 }}>Rs. </Text>
            {numberWithCommas(item?.item?.price)}
          </ThemedText>
          <View style={styles.quantityRow}>
            <CustomIconButton
              onPress={() => item.quantity==1?cart.removeItem(item.item._id):cart.decreaseQuantity(item.item._id)}
              iconName="remove"
              size={23}
              color="white"
              style={styles.minus}
            />

            <ThemedText style={styles.quantityTxtContainer}>
              {item.quantity}
            </ThemedText>
            <CustomIconButton
              onPress={() => cart.increaseQuantity(item.item._id)}
              iconName="add"
              size={23}
              color="white"
              style={styles.plus}
            />
          </View>
        </View>
      </TouchableOpacity>
  );
};

export default CartItemCard;

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 15,
    marginHorizontal: 10,
    padding: 5,
    marginVertical: 10,
    elevation: 5,
    overflow: "hidden",
  },
  imgContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: "contain",
    backgroundColor: "#FFFFFF",
    marginRight: 10,
  },
  quantityTxtContainer: {
    fontSize: 16,
    borderTopWidth: 0.8,
    borderColor: Colors.light.primary,
    borderBottomWidth: 0.8,
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  quantityRow: {
    flexDirection: "row",
    marginVertical: 5,
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    paddingRight: 10,
  },
  plus: {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: Colors.light.primary,
  },
  minus: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 5,
    backgroundColor: Colors.light.primary,
  },
});
