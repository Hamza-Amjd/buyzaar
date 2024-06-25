import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  useColorScheme,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "../redux/CartReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AnimatedLottieView from "lottie-react-native";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";

export default function cart() {
  const navigation = useNavigation();
  const colorScheme=useColorScheme();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  //@ts-ignore
  const cart = useSelector((state) => state.cart.cart);
  //@ts-ignore
  const total = cart.map((item) => item.price * item.quantity).reduce((curr, prev) => curr + prev, 0);

  const handleCart = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      axios
        .post("https://shopro-backend.vercel.app/api/shop/addtocart", {
          userId: userId,
          cart: cart,
        })
        .then((response) => {})
        .catch((error) => {
          console.log("failed to add item", error);
        });
    }
  };
  const fetchCart = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      await axios
        .get(`https://shopro-backend.vercel.app/api/shop/cart/${userId}`)
        .then((response) => {
          if ((response.status = 200)) {
            console.log(response.data);
            setProducts(response.data);
          }
        })
        .catch((error) => {
          console.log("registration failed", error);
        });
    }
  };

  //@ts-ignore
  const onRemoveFromCart = (item) => {
    dispatch(removeFromCart(item));
  };
  //@ts-ignore
  const onIncreseQuantity = (item) => {
    dispatch(incrementQuantity(item));
  };
  //@ts-ignore
  const ondecreseQuantity = (item) => {
    if (item.quantity == 1) {
      dispatch(removeFromCart(item));
    } else {
      dispatch(decrementQuantity(item));
    }
  };
  //@ts-ignore
  const renderItem= ({ item }) => {
    return (
    <TouchableOpacity
      onPress={() => {
        //@ts-ignore
        navigation.navigate("productdetails", { item });
      }}
      style={[styles.productContainer,{backgroundColor:Colors[colorScheme??'light'].background2}]}
    >
      <View style={styles.imgContainer}>
        <Image
          style={{
            width: 100,
            height: 100,
            resizeMode: "contain",
            borderRadius: 10,
          }}
          source={{ uri: item.image }}
        />
        </View>
      <View
        style={{
          justifyContent: "space-around",
          alignContent: "center",
        }}
      >
        <View style={{  }}>
          <ThemedText numberOfLines={2} type="defaultSemiBold" style={{paddingRight:10,width:"70%"}}>
            {item.title}
          </ThemedText>
        </View>
        <ThemedText type="defaultSemiBold" style={{color:Colors.light.tertiary}}> $ {item.price}</ThemedText>
        <View style={{ flexDirection:"row", marginVertical: 5,alignSelf:'center',width:"70%",paddingRight:10 }}>
          {item.quantity !== 1 ? (
            <TouchableOpacity onPress={() => ondecreseQuantity(item)}>
              <Feather
                name="minus"
                size={23}
                color="white"
                style={{
                  borderTopLeftRadius: 3,
                  borderBottomLeftRadius: 5,
                  backgroundColor: Colors.light.primary,
                }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => onRemoveFromCart(item)}>
              <MaterialCommunityIcons
                name="delete"
                size={20}
                color="white"
                style={{
                  backgroundColor: Colors.light.primary,
                  borderTopLeftRadius: 3,
                  borderBottomLeftRadius: 3,
                  padding:2
                }}
              />
            </TouchableOpacity>
          )}

          <ThemedText
            style={{
              fontSize: 16,
              borderTopWidth: 0.8,
              borderColor: Colors.light.primary,
              borderBottomWidth: 0.8,
              paddingHorizontal: 10,
              lineHeight:22
            }}
          >
            {item.quantity}
          </ThemedText>
          <TouchableOpacity onPress={() => onIncreseQuantity(item)}>
            <Feather
              name="plus"
              size={23}
              color="white"
              style={{
                borderTopRightRadius: 3,
                borderBottomRightRadius: 3,
                backgroundColor: Colors.light.primary,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )}
  useEffect(() => {
    setProducts(cart);
    handleCart();
  }, [cart]);
  return (
    <ThemedView style={styles.container}>
          <View style={{flex:1}}>
        <TouchableOpacity
          style={{marginLeft:15}}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={35} color={Colors[colorScheme??'light'].text} />
          </TouchableOpacity>
        {cart.length == 0 && (
          <View style={{flex:1,justifyContent:'center',alignItems:'center',paddingTop:150}}>
            <AnimatedLottieView
            autoPlay
            loop
            speed={0.3}
            style={{ height: 150, width: 150 }}
            source={require("../assets/images/emptyCart.json")}
          />
          </View>
        )}
        <FlatList
          data={products}
          keyExtractor={(item:any) => item._id}
          style={{marginBottom:100}}
          renderItem={renderItem}
        />
      </View>
      <View style={{position:'absolute',bottom:15,width:"97%"}}>
        <View style={styles.titleRow}>
          <ThemedText type="subtitle" >SubTotal :</ThemedText>
          <ThemedText type="subtitle" style={{color:Colors.light.tertiary}} >$ {total}</ThemedText>
        </View>

        <TouchableOpacity
          onPress={() => router.push("confirmorder")}
          disabled={total == 0}
          style={[styles.buyRow,total != 0 ? {backgroundColor:Colors.light.primary}:{backgroundColor: Colors.light.gray}]}
        >
          <MaterialCommunityIcons
            style={{  bottom: 3 }}
            name="cart-arrow-right"
            size={24}
            color={total != 0 ? Colors.light.secondary : Colors.light.white}
          />
          <Text
            style={{
              marginLeft: 10,
              fontWeight: "bold",
              fontSize: 18,
              color: total != 0 ? Colors.light.secondary : Colors.light.white,
            }}
          >
            C H E A K O U T
          </Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'space-between',
    paddingTop:35
  },
  productContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderRadius: 15,
    marginHorizontal: 10,
    padding:5,
    marginVertical: 10,
    elevation: 5,
    overflow: "hidden",
  },
  imgContainer:{
    width:100,
    height:100,
    borderRadius:10,
    resizeMode:'contain',
    backgroundColor:'#FFFFFF',
    marginRight:10
  },
  titleRow: {
    marginTop: 10,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buyRow:{
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    padding:10,
    width: "95%",
    alignSelf: "center",
  },
});
