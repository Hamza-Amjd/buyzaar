import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  useColorScheme,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import {
  Ionicons,
  MaterialCommunityIcons,
  EvilIcons,
  AntDesign,
} from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
} from "../redux/CartReducer";
import { addTofavorite } from "../redux/FavorateReducer";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { router } from "expo-router";
import ProductVarients from "@/components/ProductVarients";

const productDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const [selectedVarient, setSelectedVarient] = useState('S')
  // @ts-ignore
  const { item } = route.params;
  const [quantity, setQuantity] = useState(item?.quantity?item.quantity:0)
  let { title, image, price, description, rating } = item;
  // @ts-ignore
  const favorite = useSelector((state) => state.favorite.favorite);
  // @ts-ignore
  const cart = useSelector((state) => state.cart.cart);
  const [showfulldesc, setshowfulldesc] = useState(false);
  // @ts-ignore
  const onAddToCart = (item) => {
    dispatch(addToCart(item));
  };
  // @ts-ignore
  const onAddToFavorite = (item) => {
    dispatch(addTofavorite(item));
  };
  // @ts-ignore
  const onIncreseQuantity = (item) => {
    setQuantity(quantity+1);
    if(!cart.some((value: any) => value._id == item._id))
    dispatch(addToCart(item));
    else
    dispatch(incrementQuantity(item));
  };
  // @ts-ignore
  const ondecreseQuantity = (item) => {
    if (item.quantity == 1) {
      // @ts-ignore
      dispatch(removeFromCart(item));
    } else {
      dispatch(decrementQuantity(item));
    }
  };
  const width = Dimensions.get("screen").width;
  return (
    <>
      <ParallaxScrollView
        headerImage={
          <Image
            style={{
              width: width,
              aspectRatio: 1,
              resizeMode: "contain",
              backgroundColor: "#fff",
            }}
            source={{ uri: image }}
          />
        }
      >
        <StatusBar translucent backgroundColor={"transparent"} />
        <ThemedView
          style={{
            width: "100%",
            flex: 1,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            paddingBottom:140,
            backgroundColor:Colors[colorScheme??'light'].background2
          }}
        >
          <View style={styles.titleRow}>
            <ThemedText type="subtitle" style={{ flex:1}}>
              {title}
            </ThemedText>
            
          </View>
          <View style={styles.titleRow}>
          <View style={{flexDirection:'row',alignItems:'baseline'}}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 22,
                color: "tomato",
              }}
            >
              $ {price}
            </Text>
            <Text style={{color:Colors[colorScheme??'light'].gray,marginLeft:5,textDecorationLine:'line-through'}}>
               {price*2}
            </Text>
            <ThemedText type="defaultSemiBold"> -51%</ThemedText>
            </View>
            <ThemedText>798 Sold</ThemedText>
          </View>
          <View style={styles.titleRow}>
            <View style={{flexDirection:'row'}}>
              {[1, 2, 3, 4, 5].map((index) => (
                <Ionicons key={index} name="star" size={20} color="gold" style={{marginRight:1}}/>
              ))}
              <ThemedText type="default"> {rating?.rate}/5</ThemedText>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
              {item?.quantity !== 1 ? (
                <TouchableOpacity onPress={() => ondecreseQuantity(item)}>
                  <EvilIcons
                    name="minus"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity disabled={true} onPress={() => {}}>
                  <EvilIcons
                    name="minus"
                    size={25}
                    color={Colors[colorScheme ?? "light"].gray}
                  />
                </TouchableOpacity>
              )}

              <ThemedText type="default" style={{ marginHorizontal: 5 }}>
                {quantity}
              </ThemedText>
              <TouchableOpacity onPress={() => onIncreseQuantity(item)}>
                <EvilIcons
                  name="plus"
                  size={25}
                  color={Colors[colorScheme ?? "light"].text}
                />
              </TouchableOpacity>
            </View>
          </View>

          <ThemedText
            type="subtitle"
            style={styles.titleRow}
          >
            Description
          </ThemedText>

          <ThemedText
            type="default"
            onPress={() => setshowfulldesc(!showfulldesc)}
            numberOfLines={showfulldesc ? 10 : 5}
            style={{
              fontWeight: "regular",
              fontSize: 14,
              margin: 15,
              textAlign:'justify'
            }}
          >
            {description}
          </ThemedText>
          <ThemedText
            type="subtitle"
            style={styles.titleRow}
          >
            Specification
          </ThemedText>
          <ThemedText
            type="subtitle"
            style={styles.titleRow}
          >
            Varients
          </ThemedText>
          <ProductVarients selected={selectedVarient} setSelected={setSelectedVarient} />
          <View style={[styles.titleRow,{backgroundColor:Colors.light.secondary,borderRadius:25}]}>
            <TouchableOpacity style={{ flexDirection: "row", left: 10 }}>
              <Ionicons name={"location-sharp"} size={20} />
              <Text style={{ fontWeight: "bold", color: Colors.light.primary }}>
                Lahore
              </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", right: 10 }}>
              <MaterialCommunityIcons
                name="truck-delivery"
                size={20}
                color="black"
              />
              <Text style={{ fontWeight: "bold", color: Colors.light.primary }}>
                Free Delivery
              </Text>
            </View>
          </View>
        </ThemedView>
      </ParallaxScrollView>
      <View style={styles.bar}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={30} />
        </TouchableOpacity>
        <TouchableOpacity>
          <AntDesign
            onPress={() => {
              onAddToFavorite(item);
            }}
            name={
              favorite.some((value: any) => value._id == item._id)
                ? "heart"
                : "hearto"
            }
            size={30}
            color={
              favorite.some((value: any) => value._id == item._id)
                ? "red"
                : Colors.light.primary
            }
          />
        </TouchableOpacity>
      </View>
      <View style={styles.buyRow}>
        <TouchableOpacity
          onPress={() => {
            onAddToCart(item);
            //@ts-ignore 
            navigation.navigate("confirmorder");
          }}
          style={{
            backgroundColor: Colors.light.primary,
            borderRadius: 14,
            padding: 10,
            width: "40%",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
              color: Colors.light.secondary,
              textAlign: "center",
            }}
          >
            <MaterialCommunityIcons
              name="shopping"
              size={24}
              color={Colors.light.secondary}
            />
            BUY NOW
          </Text>
        </TouchableOpacity>
        {cart.some((value: any) => value._id == item._id) ? (
          <TouchableOpacity
            onPress={() => router.push("/cart")}
            style={{
              backgroundColor: Colors.light.primary,
              borderRadius: 14,
              padding: 10,
              width: "55%",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                color: Colors.light.secondary,
                textAlign: "center",
              }}
            >
              <MaterialCommunityIcons
                name="cart-check"
                size={24}
                color={Colors.light.secondary}
              />
              ADDED TO CART
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => onAddToCart(item)}
            style={{
              backgroundColor: Colors.light.primary,
              borderRadius: 14,
              padding: 10,
              width: "55%",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                textAlign: "center",
                color: Colors.light.secondary,
              }}
            >
              <MaterialCommunityIcons
                name="cart"
                size={24}
                color={Colors.light.secondary}
              />
              ADD TO CART
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default productDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.white,
    paddingTop: 30,
  },
  bar: {
    padding: 12,
    position: "absolute",
    top: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleRow: {
    flex: 1,
    marginTop: 14,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buyRow: {
    position: "absolute",
    bottom: 10,
    marginTop: 14,
    marginHorizontal: 15,
    flexDirection: "row",
    width: "93%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buybtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    height: 32,
    elevation: 5,
  },
});
