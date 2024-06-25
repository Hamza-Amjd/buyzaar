import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Product from "@/components/Product";
import axios from "axios";

import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";

export default function category() {
  const route = useRoute();
  const { category } = useLocalSearchParams<{category:string}>();
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();
  const updateProducts = async () => {
    await axios.get(`https://shopro-backend.vercel.app/api/admin/items?limit=100&category=${category}`).then((response)=> {
      if ((response.status = 200)) {
        setProducts(response.data.item);
      }
    })
    .catch((error) => {
      console.log("fetching products failed", error.message);
    })
    
  };

  useEffect(() => {
    updateProducts();
  }, []);

  return (
    <View style={{paddingTop:25,paddingBottom:30 }}>
      <View style={styles.bar}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <ThemedText
      type="title"><Ionicons name="arrow-back" size={30} /></ThemedText>
          
        </TouchableOpacity>
      <ThemedText
      type="subtitle"
        style={{
          margin: 10,
        }}
      >
       {category?.toUpperCase()}
      </ThemedText>
      </View>
      
      <FlatList
        data={products}
        keyExtractor={(item:any,index) => item._id+index}
        renderItem={({ item }) => <Product item={item}/>}
        numColumns={2}
        contentContainerStyle={{
          columnGap: 15,
          rowGap: 12,
        }}
        columnWrapperStyle={{ marginHorizontal: 10 }}
        style={{paddingBottom:30}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    margin: 15,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems:'center'
  },
});
