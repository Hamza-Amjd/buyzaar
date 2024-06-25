import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import axios from "axios";
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs'
import SearchTile from "@/components/SearchTile";
import { ThemedView } from "@/components/ThemedView";

const search = () => {
  const[searchKey,setSearchKey]=useState<any>()
  const[searchResults,setSearchResults]=useState([])
  const tabBarHieght=useBottomTabBarHeight();
  const search=async()=>{
      await axios.get(`https://shopro-backend.vercel.app/api/admin/items?limit=100&search=${searchKey}`).then((response)=> {
        if ((response.status = 200)) {
          setSearchResults(response.data.item);
        }
      })
      .catch((error) => {
        console.log("fetching products failed", error.message);
      })
      
    
  }
  useEffect(() => {
    search();
    if(searchKey?.length==0){setSearchResults([])}
  }, [searchKey])
  
  return (
    <ThemedView style={{flex:1,padding:10,paddingTop:40}}>
        <View style={styles.searchbar}>
          <TextInput
            style={styles.searchInput}
            placeholder="looking for something?"
            value={searchKey}
            onChangeText={setSearchKey}
          />
          <TouchableOpacity style={styles.searchIcon} onPress={search} >
            <EvilIcons  name={"search"} color="white" size={30} />
          </TouchableOpacity>
        </View>
        {searchKey?.length>0 && searchResults.length>0 &&  
            <FlatList
              data={searchResults}
              keyExtractor={(item:any)=>item._id}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <SearchTile item={item}/>
              )}
              contentContainerStyle={{paddingBottom:tabBarHieght}}
              />
        }
        </ThemedView>
  );
};
const styles = StyleSheet.create({
  searchbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors["light"].secondary,
    borderRadius: 15,
    height: 50,
  },
  searchIcon: {
    backgroundColor: Colors["light"].gray,
    padding: 5,
    borderRadius:15,
    marginRight:4
  },
  searchInput: {
    flex:1,
    marginHorizontal: 15,
  },
});
export default search;
