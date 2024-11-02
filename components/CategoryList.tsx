import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import { Entypo, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
const categories = [
    {
      name: "men's ",
      icon: <Ionicons name="shirt-sharp" size={35} color="white" />,
    },
    {
      name: "women's",
      icon: (
        <MaterialCommunityIcons name="tshirt-crew" size={35} color="white" />
      ),
    },
    {
      name: "electronics",
      icon: (
        <MaterialCommunityIcons name="power-plug" size={35} color="white" />
      ),
    },
    {
      name: "Mobile",
      icon: (
        <Entypo name="mobile" size={35} color="white" />
      ),
    },
    {
      name: "Furniture",
      icon: (
        <MaterialIcons name="chair" size={35} color="white" />
      ),
    },
    {
      name: "Screens",
      icon: (
        <FontAwesome name="tv" size={35} color="white" />
      ),
    },
    {
      name: "jewelery",
      icon: <MaterialCommunityIcons name="necklace" size={35} color="white" />,
    },
  ];
const CategoryList = () => {
    const  colorScheme = useColorScheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((category, index) => {
                return (
                  <Link
                    href={`/category?name=${category.name}`}
                    key={index}
                    asChild
                  >
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={[
                          styles.category,
                          {
                            backgroundColor:
                              Colors[colorScheme ?? "light"].primary,
                          },
                        ]}
                      >
                        {category.icon}
                      </View>
                      {/* <ThemedText
                        type="default"
                        style={{ textTransform: "capitalize" }}
                      >
                        {category.name.replace(/ ./, "")}</ThemedText> */}
                    </TouchableOpacity>
                  </Link>
                );
              })}
            </ScrollView>
  )
}


const styles = StyleSheet.create({
    categorytxt: {
        fontSize: 32,
        fontWeight: "bold",
        paddingHorizontal: 7,
    },
      category: {
          borderWidth: 1,
          borderRadius: 50,
          padding: 7,
          margin: 5,
          marginVertical: 10,
        },
})

export default CategoryList