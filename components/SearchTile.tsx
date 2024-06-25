import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, useColorScheme } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors} from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
type searchTileProps={
  item:any
}
const SearchTile:React.FC<searchTileProps> = ({ item}) => {
  const navigation = useNavigation();
  const colorSchene=useColorScheme();
  return (
    <TouchableOpacity
      onPress={() => {
        //@ts-ignore
        navigation.navigate("productdetails", { item });
      }}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={[styles.productMain,{backgroundColor:Colors[colorSchene??'light'].background3}]}>
        <View style={styles.imgContainer}>
          <Image
          style={{
            width: 40,
            height: 40,
            resizeMode: "contain",
          }}
          source={{ uri: item.image }}
        />
        </View>
        

        <View
          style={{
            justifyContent: "flex-start",
            alignContent: "center",
            marginLeft: 15,
          }}
        >
          <ThemedText style={styles.text}>
            {item.title?.length > 40
              ? item.title.slice(0, 40) + "..."
              : item.title}
          </ThemedText>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.pricetext}>
              {" "}
              $ {item.price}
            </Text>
            <Text>{item.quantity && " x" + item.quantity}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SearchTile;

const styles = StyleSheet.create({
  productMain: {
    width:'100%',
    flexDirection: "row",
    borderRadius: 15,
    marginVertical: 5,
    padding: 5,
  },
  imgContainer:{
    width: 40,
    height: 40,
    resizeMode: "contain",
    backgroundColor:"#fff",
    borderRadius:7,
  },
  text: {
    fontSize: 14,
    fontWeight: "400",
  },
  pricetext: {
    color: "#C60C30",
    fontSize: 14,
    fontWeight: "bold",
  },
  cartcount: {
    width: 20,
    height: 20,
    borderRadius: 50,
    alignItems: "center",
    backgroundColor: Colors["light"].primary,
    justifyContent: "center",
  },
});
