import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import Product from "@/components/ProductCard";
import axios from "axios";

import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { router, useLocalSearchParams } from "expo-router";
import Header from "@/components/Header";

export default function category() {
  const  {name}  = useLocalSearchParams<{ name: string }>();
  const [products, setProducts] = useState([]);
  const updateProducts = async () => {
    await axios.get(`https://buyzaar-backend.vercel.app/api/admin/items?limit=100t`).then((response)=> {
      if ((response.status = 200)) {
        console.log(response.data.item);
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
      <Header title={name}/>
      
      <FlatList
        data={products}
        keyExtractor={(item:any,index) => item._id+index}
        renderItem={({ item }) => <ThemedText >{'abt'}</ThemedText>}
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
