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
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import SearchTile from "@/components/ui/SearchTile";
import { ThemedView } from "@/components/ui/ThemedView";
import { getSearchedProducts } from "@/services/api/actions";
import { ThemedText } from "@/components/ui/ThemedText";

const search = () => {
  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const tabBarHieght = useBottomTabBarHeight();
  const search = async () => {
    await getSearchedProducts(searchKey).then((results) =>
      setSearchResults(results)
    );
  };
  useEffect(() => {
    if (searchKey.length > 0) search();
  }, [searchKey]);

  return (
    <ThemedView style={{ flex: 1, padding: 10 }}>
      <View style={styles.searchbar}>
        <TextInput
          style={styles.searchInput}
          placeholder="looking for something?"
          value={searchKey}
          onChangeText={setSearchKey}
        />
        <TouchableOpacity style={styles.searchIcon} onPress={search}>
          <EvilIcons name={"search"} color="white" size={30} />
        </TouchableOpacity>
      </View>
      {searchKey?.length > 0 ? (
        searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={(item: any) => item._id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <SearchTile item={item} />}
            contentContainerStyle={{ paddingBottom: tabBarHieght }}
          />
        )
      ) : (
        <View
          style={styles.emptyContainer}
        >
          <EvilIcons name={"search"} color={"grey"} size={80} />

          <ThemedText
            type="defaultSemiBold"
            style={{ color: "grey"}}
          >
            Search anything you want.
          </ThemedText>
        </View>
      )}
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
    borderRadius: 15,
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 15,
  },
  emptyContainer:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  }
});
export default search;
