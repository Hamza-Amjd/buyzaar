import { StyleSheet, Text, View, Image, TouchableOpacity, useColorScheme } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { addTofavorite, removeFromfavorite } from "@/redux/FavorateReducer";
import { router } from "expo-router";
import { ThemedText } from "./ThemedText";
type productProps={
  item:any,
}
const Product:React.FC<productProps> = ({item}) => {
  const dispatch=useDispatch();
  const favorite = useSelector((state:any) => state.favorite.favorite);
  const { title, image, price,rating } = item;
  const navigation = useNavigation();
  const [fav, setfav] = useState(false)
  const onAddToFavorite = (item:any) => {
    dispatch(addTofavorite(item));
  };
  const colorScheme=useColorScheme()
  return (
        <TouchableOpacity
          style={[styles.productContainer,{backgroundColor:Colors[colorScheme??'light'].background3}]}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("productdetails",{item})   
          }}
        >
        <View style={[styles.imgContainer,{backgroundColor:Colors['light'].white}]}>  
          <TouchableOpacity onPress={()=>{setfav(!fav);onAddToFavorite(item)}} style={styles.fav}>
          {/* @ts-ignore */}
          <AntDesign  name={favorite.some((value) => value._id == item._id)?'heart':"hearto"} size={30} color={(favorite.some((value) => value._id == item._id)?'red':Colors["light"].primary)} />
          </TouchableOpacity>
          <Image style={styles.img} source={{ uri: image }} />
          <View style={{position:"absolute",right:0,bottom:0,backgroundColor:Colors.light.gray,padding:5,borderTopLeftRadius:10}}>
            <Text style={{color:"gold",fontSize:12,fontWeight:'bold',}}><Ionicons name='star' size={10} /> {rating.rate}</Text>

          </View>
        </View>
        <Text style={styles.price}>${price}</Text>
        <ThemedText type="default" style={{left:7}}>
          {title.length > 40 ? title.slice(0, 40)+'...' : title}
        </ThemedText>   
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  productContainer: {
    width: 182,
    height: 240,
    backgroundColor: Colors["light"].background,
    borderRadius: 16,
    marginRight:5,
    marginBottom: 5,
    elevation:5
  },
  imgContainer: {
    width: 170,
    height: 170,
    overflow: "hidden",
    marginLeft: 5,
    marginTop: 5,
    borderRadius: 10,
  },
  img: {
    aspectRatio: 1,
    resizeMode: "contain",
  },
  fav:{
    position:'absolute',
    top:10,
    right:10,
    zIndex:999,
  },
  price: {
    marginLeft: 7,
    fontWeight: "bold",
    fontSize: 16,
    color: "tomato",
  },
});

export default Product;