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
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
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
  clearCart,
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
import { numberWithCommas } from "@/utils/healper";
import axios from "axios";
import Product from "@/components/Product";

const productDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const [selectedVarient, setSelectedVarient] = useState("S");
  const [suggestedproducts, setSuggestedproducts] = useState([]);
  const [loading, setLoading] = useState(false);
  // @ts-ignore
  const { item } = route.params;
  const [quantity, setQuantity] = useState(item?.quantity ? item.quantity : 0);
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
    setQuantity(quantity + 1);
    if (!cart.some((value: any) => value._id == item._id))
      dispatch(addToCart(item));
    else dispatch(incrementQuantity(item));
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
  const fetchSuggestions = async () => {
    setLoading(true);
    await axios
      .get(
        `https://buyzaar-backend.vercel.app/api/admin/items?limit=100&category=${item.category}`
      )
      .then((response) => {
        if ((response.status = 200)) {
          setSuggestedproducts(response.data.item);
          // setSuggestedproducts(suggestedproducts.filter((product:any)=>{return product._id !== item._id}));
        }
      })
      .catch((error) => {
        console.log("fetching suggested products failed", error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchSuggestions();
  }, []);

  const width = Dimensions.get("screen").width;
  return (
    <>
      <ParallaxScrollView
        headerImage={
          <View style={{ width: width, height: 393 }}>
            <Image
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
                backgroundColor: "#fff",
              }}
              source={{ uri: item?.image }}
            />
          </View>
        }
      >
        <StatusBar translucent backgroundColor={"transparent"} />
        <ThemedView
          style={{
            width: "100%",
            flex: 1,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            paddingBottom: 140,
            backgroundColor: Colors[colorScheme ?? "light"].background2,
          }}
        >
          <View style={styles.titleRow}>
            <ThemedText type="subtitle" style={{ flex: 1 }}>
              {item?.title}
            </ThemedText>
          </View>
          <View style={styles.titleRow}>
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 22,
                  color: "tomato",
                }}
              >
                <Text style={{ fontSize: 18 }}>Rs. </Text>
                {numberWithCommas(item?.price)}
              </Text>
              <Text
                style={{
                  color: Colors[colorScheme ?? "light"].gray,
                  marginLeft: 5,
                  textDecorationLine: "line-through",
                }}
              >
                {numberWithCommas(((item?.price - 10) * 2).toString())}
              </Text>
              <ThemedText type="defaultSemiBold"> -51%</ThemedText>
            </View>
            {item?.soldQuantity ? (
              <ThemedText>{item?.soldQuantity} Sold</ThemedText>
            ) : (
              <View
                style={[
                  styles.inventoryStatus,
                  {
                    backgroundColor: Colors[colorScheme ?? "light"].background2,
                  },
                ]}
              >
                <ThemedText style={{ color: "green", fontSize: 12 }}>
                  IN STOCK
                </ThemedText>
              </View>
            )}
          </View>
          <View style={styles.titleRow}>
            {item?.rating ? (
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                {[...new Array(5)].map((_, i) =>{
                  let name:any= item?.rating.rate >=i ?item?.rating.rate >=(i+0.5)? "star":"star-half-outline":"star-outline"
                  return (
                    <Ionicons
                      key={i}
                      name={name}
                      size={20}
                      color={"gold"}
                    />
                  );}
                )}
                <ThemedText type="default"> {item?.rating?.rate}/5</ThemedText>
              </View>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                {[...new Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star-outline"
                    size={20}
                    color="gold"
                  />
                ))}
                <ThemedText type="default"> 0/5</ThemedText>
              </View>
            )}
            <View style={styles.flex}>
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

          <ThemedText type="subtitle" style={styles.titleRow}>
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
              textAlign: "justify",
            }}
          >
            {item?.description}
          </ThemedText>
          {/* <ThemedText
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
          <ThemedText
            type="subtitle"
            style={styles.titleRow}
          >
            Rating
          </ThemedText>*/}
          <View
            style={[
              styles.titleRow,
              { backgroundColor: Colors.light.secondary, borderRadius: 25 },
            ]}
          >
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
          <ThemedText type="subtitle" style={styles.titleRow}>
            Suggestions
          </ThemedText>
          {loading ? (
            <ActivityIndicator size={"large"} style={{ paddingTop: 20 }} />
          ) : (
            <FlatList
              scrollEnabled={false}
              data={suggestedproducts}
              keyExtractor={(item: any) => `${item._id}`}
              renderItem={({ item }) => <Product item={item} />}
              numColumns={2}
              contentContainerStyle={{
                paddingTop: 10,
                columnGap: 16,
                rowGap: 10,
              }}
              columnWrapperStyle={{ marginHorizontal: 10 }}
            />
          )}
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
      <ThemedView
        style={[
          styles.buyRow,
          { backgroundColor: Colors[colorScheme ?? "light"].background2 },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            dispatch(clearCart());
            onAddToCart(item);
            //@ts-ignore
            navigation.navigate("confirmorder");
          }}
          style={[styles.buybtn, { width: "40%" }]}
        >
          <Text style={styles.btntxt}>
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
            style={[styles.buybtn, { width: "55%" }]}
          >
            <Text style={styles.btntxt}>
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
            style={[styles.buybtn, { width: "55%" }]}
          >
            <Text style={styles.btntxt}>
              <MaterialCommunityIcons
                name="cart"
                size={24}
                color={Colors.light.secondary}
              />
              ADD TO CART
            </Text>
          </TouchableOpacity>
        )}
      </ThemedView>
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
  flex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: {
    flex: 1,
    marginTop: 14,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inventoryStatus: {
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 5,
    padding: 3,
    elevation: 7,
    shadowColor: "green",
  },
  buyRow: {
    position: "absolute",
    bottom: 0,
    padding: 8,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  buybtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    padding: 10,
    elevation: 5,
  },
  btntxt: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    color: Colors.light.secondary,
  },
});
