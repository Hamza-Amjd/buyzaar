import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  useColorScheme,
  Dimensions,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Ionicons,
  MaterialCommunityIcons,
  EvilIcons,
} from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { router, useLocalSearchParams } from "expo-router";
import { numberWithCommas } from "@/utils/healper";
import Product from "@/components/ProductCard";
import Carousel from "react-native-reanimated-carousel";
import { getProductDetails, getRelatedProducts } from "@/utils/actions";
import Header from "@/components/Header";
import WishlistButton from "@/components/WishlistButton";
import useCart, { CartItem } from "@/hooks/useCart";
import Animated from "react-native-reanimated";

const productDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [product, setProduct] = useState<ProductType | any>();
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showfulldesc, setshowfulldesc] = useState(false);
  const [showImageModal, setshowImageModal] = useState(false);
  const [selectedImageIndex, setSeletedImageIndex] = useState(0);
  useEffect(() => {
    setLoading(true);
    getProductDetails(id).then((product) => {
      setProduct(product);
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[0]);
      setLoading(false);
    });
    getRelatedProducts(id).then((relatedProducts) =>
      setRelatedProducts(relatedProducts)
    );
  }, []);
  const [quantity, setQuantity] = useState(1);
  const cart = useCart();

  const handleAddToCart = () => {
    //@ts-ignore
    cart.addItem({
      item: product,
      quantity,
      color: selectedColor,
      size: selectedSize,
    });
  };

  const handleBuynow = () => {
    cart.clearCart();
    handleAddToCart();
    router.push('/cart')
  };

  const width = Dimensions.get("screen").width;
  return loading ? (
    <ThemedView style={styles.container}>
      <ActivityIndicator size={"large"} />
    </ThemedView>
  ) : (
    <>
      <ParallaxScrollView
        headerImage={
          <View style={{ width: width, height: 393 }}>
            <Carousel
              width={width}
              height={393}
              data={product.media}
              onSnapToItem={(index)=>setSeletedImageIndex(index)}
              renderItem={({ item, index}) => (
                <TouchableWithoutFeedback
                  style={{ flex: 1 }}
                  key={index}
                  onPress={() => {
                    setshowImageModal(true);
                  }}
                >
                  <Animated.Image style={{ flex: 1 }} source={{ uri: item as string }} sharedTransitionTag={""}/>
                  
                </TouchableWithoutFeedback>
              )}
            />
            <View
              style={{
                flexDirection: "row",
                gap: 2,
                position: "absolute",
                bottom: 20,
                right: 10,
              }}
            >
              {product?.media.map((img: string, i: number) => (
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderWidth: selectedImageIndex == i ? 1.5 : 0.3,
                    borderColor: "black",
                    borderRadius: 3,
                  }}
                  key={img}
                  source={{ uri: img }}
                />
              ))}
            </View>
          </View>
        }
      >
        <ThemedView
          style={[
            styles.infoContainer,
            { backgroundColor: Colors[colorScheme ?? "light"].background3 },
          ]}
        >
          
          <View style={styles.titleRow}>
            <ThemedText type="subtitle" style={{ flex: 1 }}>
              {product?.title}
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
                {product?.price && numberWithCommas(product?.price)}
              </Text>
              <Text
                style={{
                  color: Colors[colorScheme ?? "light"].gray,
                  marginLeft: 5,
                  textDecorationLine: "line-through",
                }}
              >
                {product?.price &&
                  numberWithCommas((product?.price * 1.12).toFixed(0))}
              </Text>
              <ThemedText type="defaultSemiBold"> -12%</ThemedText>
            </View>
            {product?.soldQuantity ? (
              <ThemedText>{product?.soldQuantity} Sold</ThemedText>
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
            {product?.rating ? (
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                {[...new Array(5)].map((_, i) => {
                  let name: any =
                    product?.rating.rate >= i
                      ? product?.rating.rate >= i + 0.5
                        ? "star"
                        : "star-half-outline"
                      : "star-outline";
                  return (
                    <Ionicons key={i} name={name} size={20} color={"gold"} />
                  );
                })}
                <ThemedText type="default">
                  {" "}
                  {product?.rating?.rate}/5
                </ThemedText>
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
              <TouchableOpacity
                disabled={quantity == 1}
                onPress={() => setQuantity(quantity - 1)}
              >
                <EvilIcons
                  name="minus"
                  size={25}
                  color={
                    quantity !== 1
                      ? Colors[colorScheme ?? "light"].text
                      : Colors[colorScheme ?? "light"].gray
                  }
                />
              </TouchableOpacity>

              <ThemedText type="default" style={{ marginHorizontal: 5 }}>
                {quantity}
              </ThemedText>
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
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
            style={styles.desc}
          >
            {product?.description}
          </ThemedText>
          {product?.colors.length>0 && (
            <View>
              <ThemedText type="subtitle" style={styles.titleRow}>
                Colors
              </ThemedText>
              <View
                style={styles.colorContainer}
              >
                {product.colors.map((color: string, index: string) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedColor(color)}
                    style={{alignItems:'center',justifyContent:'center',gap:5}}
                  >
                    <View
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color && {borderColor: Colors.dark.primary},
                      ]}
                    >
                      {selectedColor === color && <Ionicons name="checkmark" size={20} color={Colors.dark.primary} />}
                    </View>
                    <ThemedText type='default' style={{textTransform:'capitalize',textAlign:'center'}}>{color}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          {product?.sizes?.length>0 && (
            <View>
              <ThemedText type="subtitle" style={styles.titleRow}>
                Varients
              </ThemedText>
              <View
                style={styles.colorContainer}
              >
                {product.sizes.map((size: string, index: string) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedSize(size)}
                  >
                    <ThemedText
                      style={[
                        styles.optionsItem,
                        { borderColor: Colors[colorScheme ?? "light"].text },
                        selectedSize == size && {
                          backgroundColor:
                            Colors[colorScheme ?? "light"].tertiary,
                          color: "white",
                        },
                      ]}
                    >
                      {size}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
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
              data={relatedProducts}
              keyExtractor={(item: any) => `${item._id}`}
              renderItem={({ item }) => <Product item={item} />}
              numColumns={2}
              contentContainerStyle={{
                 marginHorizontal:'auto',justifyContent:'space-evenly'
              }}
            />
          )}
        </ThemedView>
      </ParallaxScrollView>
      <View style={styles.bar}>
        <Header
          headerRight={<WishlistButton product={product} />}
          color={"grey"}
        />
      </View>
      <ThemedView
        style={[
          styles.buyRow,
          { backgroundColor: Colors[colorScheme ?? "light"].background2 },
        ]}
      >
        <TouchableOpacity
          style={[styles.buybtn, { width: "40%" }]}
          onPress={handleBuynow}
        >
          <Text style={styles.btntxt}>
            <MaterialCommunityIcons
              name="shopping"
              size={22}
              color={Colors.light.secondary}
            />
            BUY NOW
          </Text>
        </TouchableOpacity>
        {cart.cartItems.some(
          (item: CartItem) => item.item._id == product?._id
        ) ? (
          <TouchableOpacity
            onPress={() => router.push("/cart")}
            style={[styles.buybtn, { width: "55%" }]}
          >
            <Text style={styles.btntxt}>
              <MaterialCommunityIcons
                name="cart-check"
                size={22}
                color={Colors.light.secondary}
              />
              ADDED TO CART
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleAddToCart}
            style={[styles.buybtn, { width: "55%" }]}
            disabled={loading}
          >
            <Text style={styles.btntxt}>
              <MaterialCommunityIcons
                name="cart"
                size={22}
                color={Colors.light.secondary}
              />
              ADD TO CART
            </Text>
          </TouchableOpacity>
        )}
      </ThemedView>
      {/* <ImageView
        animationType="slide"
        presentationStyle="fullScreen"
        swipeToCloseEnabled
        backgroundColor={Colors[colorScheme ?? "light"].background2}
        imageIndex={selectedImageIndex}
        visible={showImageModal}
        onRequestClose={() => setshowImageModal(false)}
        images={[
          ...product.media.map((img: any) => {
            return { uri: img };
          }),
        ]}
      /> */}
    </>
  );
};

export default productDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    width: "100%",
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 60,
  },
  desc: {
    fontWeight: "regular",
    fontSize: 14,
    margin: 15,
    textAlign: "justify",
  },
  bar: {
    position: "absolute",
    top: 10,
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  colorContainer:{
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    gap: 10,
  },
  optionsItem: {
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    textTransform: "capitalize",
    fontWeight: "800",
    lineHeight: 20,
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
    fontSize: 17,
    textAlign: "center",
    color: Colors.light.secondary,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "grey",
  },
});