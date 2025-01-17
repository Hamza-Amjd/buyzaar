import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  useColorScheme,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ui/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { router } from "expo-router";
import Collections from "@/components/home/Collections";
import useCart from "@/services/cartStore";
import AddressBottomModal from "@/components/modals/AddressBottomModal";
import { getCollectionDetails, getProducts } from "@/services/api/actions";
import CategoryList from "@/components/home/CategoryList";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import useLocation from "@/hooks/useLocation";
import ProductCard from "@/components/home/ProductCard";
import CustomIconButton from "@/components/ui/CustomIconButton";

export default function Home() {
  const colorScheme = useColorScheme();
  const cart = useCart();
  const [products, setProducts] = useState<any>();
  const [discountItems, setDiscountItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { location } = useLocation();

  const fetchData = async () => {
    setLoading(true);
    await getCollectionDetails("678a5a5470fbbd34d9099db3")
      .then((res) => setDiscountItems(res.products))
      .finally(() => setLoading(false));
    await getProducts()
      .then((res) => setProducts(res))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };
  const loadMoreItems = () => {
    setCurrentPage(currentPage + 1);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const renderItem = ({ item }: { item: ProductType }) => {
    return <ProductCard item={item} />;
  };
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const handlePresentModalPress = React.useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={styles.header}>
        <CustomIconButton
          onPress={handlePresentModalPress}
          iconName="location-sharp"
          size={30}
        />
        <ThemedText
          type="mediumSemiBold"
          style={{ textTransform: "capitalize", fontSize: 16 }}
          onPress={handlePresentModalPress}
        >
          {location?.city && location?.city + ", "}
          {location?.country && location?.country}
        </ThemedText>
        <TouchableOpacity
          onPress={() => {
            router.push("/cart");
          }}
        >
          <View style={{ alignItems: "flex-end" }}>
            <View style={styles.cartcount}>
              <Text style={styles.cartno}>{cart.cartItems.length}</Text>
            </View>

            <Ionicons
              name={"cart"}
              size={35}
              color={Colors[colorScheme ?? "light"].text}
            />
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }
      >
        <Collections />
        <ThemedText type="title" style={{paddingTop:20,fontSize:38,paddingLeft:10}}>
          Categories
        </ThemedText>
        <CategoryList />
        <ThemedText type="title" style={styles.text}>
          60%-OFF
        </ThemedText>
        <ThemedText style={styles.text}>
          Limited time offer <AntDesign name="arrowright" size={15} />
        </ThemedText>
        <FlatList
          data={discountItems}
          keyExtractor={(item, index) => item._id + index}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ padding: 5 }}
        />
        <ThemedText type="title" style={styles.text}>
          For you
        </ThemedText>
        <ThemedText style={styles.text}>
          Selected products only for you <FontAwesome5 name="fire" size={15} />
        </ThemedText>

        <FlatList
          data={products}
          keyExtractor={(item, index) => item._id + index}
          renderItem={renderItem}
          onRefresh={getProducts}
          refreshing={loading}
          scrollEnabled={false}
          onEndReached={loadMoreItems}
          ListFooterComponent={() => {
            return (
              footerLoading && (
                <ActivityIndicator
                  size={"large"}
                  style={{ alignSelf: "center" }}
                />
              )
            );
          }}
          numColumns={2}
          columnWrapperStyle={{ marginHorizontal: 10 }}
        />
      </ScrollView>
      <AddressBottomModal
        setAddress={setCurrentPage}
        bottomSheetModalRef={bottomSheetModalRef}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartcount: {
    bottom: 16,
    width: 18,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "green",
    position: "absolute",
    zIndex: 999,
    justifyContent: "center",
  },
  cartno: {
    color: "white",
  },
  text: {
    paddingLeft: 10,
  },
});
