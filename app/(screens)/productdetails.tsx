import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StatusBar,
  Share,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Ionicons,
  MaterialCommunityIcons,
  EvilIcons,
} from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ui/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import { router } from "expo-router";
import { getDiscount, numberWithCommas } from "@/utils/healper";
import Product from "@/components/home/ProductCard";
import { getProductDetails, getRelatedProducts } from "@/services/api/actions";
import Header from "@/components/ui/Header";
import WishlistButton from "@/components/ui/WishlistButton";
import useCart, { CartItem } from "@/services/cartStore";
import CustomButton from "@/components/ui/CustomButton";
import ProductGallery from "@/components/home/ProductGallery";
import { useRoute } from "@react-navigation/native";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import * as Linking from "expo-linking";
import CustomIconButton from "@/components/ui/CustomIconButton";

const productdetails = () => {
  const route = useRoute();
  const item: any = route.params;
  const cart = useCart();
  const colorScheme = useColorScheme();

  const isInCart = cart.cartItems.some(
    (cartitem: CartItem) => cartitem.item._id == item._id
  );

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [product, setProduct] = useState<ProductType | any>();
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showfulldesc, setshowfulldesc] = useState(false);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    getProductDetails(item?._id).then((product) => {
      setProduct(product);
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[0]);
      setLoading(false);
    });
    getRelatedProducts(item?._id).then((relatedProducts) =>
      setRelatedProducts(relatedProducts)
    );
  }, [item.title]);

  const handleAddToCart = () => {
    if(loading) return;
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
    router.push("/cart");
  };

  const handleShare = async () => {
    const redirectUrl=Linking.createURL('/(tabs)/', { scheme: "buyzaar" });
    try {
      await Share.share({
        message: `Check out this product: ${product.title} at https://${redirectUrl}`,
        // message: redirectUrl,
      });
    } catch (error) {
      console.error('Error sharing book:', error);
    }
  }

  return (
    <>
      <ParallaxScrollView
        headerImage={<ProductGallery media={loading?item.media:product.media} loading={loading}/>}
      >
        <ThemedView
          style={[
            styles.infoContainer,
            { backgroundColor: Colors[colorScheme ?? "light"].background3 },
          ]}
        >
          <View style={styles.row}>
            <ThemedText type="subtitle" style={{ flex: 1 }}>
              {item.title}
            </ThemedText>
          </View>
          <View style={styles.row}>
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text style={styles.priceText}>
                <Text style={{ fontSize: 18 }}>Rs. </Text>
                {item.discount !== "0" ? (
                  <>
                    {numberWithCommas(item.price - item.discount)}{" "}
                    <Text style={styles.oldprice}>
                      {numberWithCommas(item.price)}
                    </Text>
                    <ThemedText type="defaultSemiBold">-{getDiscount(item.price,item.discount)} %</ThemedText>
                  </>
                ) : (
                  numberWithCommas(item.price - item.discount)
                )}
              </Text>
              
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
          <View style={styles.row}>
            {item.rating ? (
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
                <ThemedText> {product?.rating?.rate}/5</ThemedText>
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
                <ThemedText> 0/5</ThemedText>
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

              <ThemedText style={{ marginHorizontal: 5 }}>
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

          <ThemedText type="subtitle" style={styles.row}>
            Description
          </ThemedText>

          <ThemedText
            onPress={() => setshowfulldesc(!showfulldesc)}
            numberOfLines={showfulldesc ? 10 : 5}
            style={styles.desc}
          >
            {item.description}
          </ThemedText>
          {!loading && product.colors.length > 0 && (
            <View>
              <ThemedText type="subtitle" style={styles.row}>
                Colors
              </ThemedText>
              <View style={styles.colorContainer}>
                {product.colors.map((color: string, index: string) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedColor(color)}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                    }}
                  >
                    <View
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color && {
                          borderColor: Colors.dark.primary,
                        },
                      ]}
                    >
                      {selectedColor === color && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={Colors.dark.primary}
                        />
                      )}
                    </View>
                    <ThemedText
                      type="default"
                      style={{
                        textTransform: "capitalize",
                        textAlign: "center",
                      }}
                    >
                      {color}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          {!loading && product.sizes?.length > 0 && (
            <View>
              <ThemedText type="subtitle" style={styles.row}>
                Varients
              </ThemedText>
              <View style={styles.colorContainer}>
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
              styles.row,
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
          <ThemedText type="subtitle" style={styles.row}>
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
                marginHorizontal: "auto",
                justifyContent: "space-evenly",
              }}
            />
          )}
        </ThemedView>
      </ParallaxScrollView>
      <View style={styles.bar}>
        <Header
          headerRight={<View style={{...styles.flex,gap:15}}><CustomIconButton onPress={handleShare} color="grey" iconName='share-social'/><WishlistButton product={item} /></View>}
          color={"grey"}
        />
      </View>
      <ThemedView
        style={[
          styles.buyRow,
          { backgroundColor: Colors[colorScheme ?? "light"].background2 },
        ]}
      >
        <CustomButton
          onPress={handleBuynow}
          title="Buy Now"
          icon={"bag"}
          style={{ flex: 0.55 }}
        />
        <CustomButton
          onPress={
            isInCart ? () => router.push("/(screens)/cart") : handleAddToCart
          }
          title={isInCart ? "Added to Cart" : "Add to Cart"}
          icon={isInCart ? "checkmark-circle" : "cart"}
          style={{ flex: 0.45 }}
        />
      </ThemedView>
    </>
  );
};

export default productdetails;

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
  row: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  colorContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    gap: 10,
  },
  priceText: {
    fontWeight: "bold",
    fontSize: 22,
    color: "tomato",
  },
  oldprice: {
    fontSize: 16,
    color: "grey",
    marginLeft: 5,
    textDecorationLine: "line-through",
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
    gap: 5,
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
