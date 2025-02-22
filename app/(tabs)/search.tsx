import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect } from "react";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import axios from "axios";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import SearchTile from "@/components/ui/SearchTile";
import { ThemedView } from "@/components/ui/ThemedView";
import {
  EXPO_PUBLIC_BASE_URL,
  getSearchedProducts,
} from "@/services/api/actions";
import { ThemedText } from "@/components/ui/ThemedText";
import FilterModal from "@/components/modals/FilterModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const search = () => {
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState<any>(null);

  const onApplyFilters = ({ min, max, sortBy }: any) => {
    setFilters({ min, max, sortBy });
    search();
  };

  const search = async () => {
    if (searchKey.length == 0) return;
    await axios
      .get(
        `${EXPO_PUBLIC_BASE_URL}/search/${searchKey}${
          filters
            ? `?${
                filters.min.length > 0 ? `minPrice=${filters.min}&` : ""
              }${
                filters.max.length > 0 ? `maxPrice=${filters.max}&` : ""
              }priceSort=${filters.sortBy}`
            : ""
        }`
      )
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    search();
  }, [searchKey]);

  return (
    <ThemedView style={{ flex: 1, padding: 10 }}>
      <View style={{ borderRadius: 10, marginBottom: 10 }}>
        <View style={styles.searchbar}>
          <TextInput
            style={styles.searchInput}
            autoComplete="off"
            autoCapitalize="none"
            placeholder="looking for something?"
            value={searchKey}
            onChangeText={setSearchKey}
          />
          <TouchableOpacity
            style={styles.searchIcon}
            onPress={() => bottomSheetModalRef.current?.present()}
          >
            <Ionicons name={"options-sharp"} color="white" size={25} />
          </TouchableOpacity>
        </View>
        {filters && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 5,
              paddingHorizontal: 10,
            }}
          >
            <ThemedText type="small">Filters Applied</ThemedText>
            <TouchableOpacity
              onPress={() => {
                setFilters(null);
                search();
              }}
            >
              <ThemedText
                type="small"
                style={{ color: "blue", textDecorationLine: "underline" }}
              >
                Reset
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {searchKey?.length > 0 ? (
        searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={(item: any) => item._id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <SearchTile item={item} />}
          />
        )
      ) : (
        <View style={styles.emptyContainer}>
          <EvilIcons name="search" color={"grey"} size={80} />

          <ThemedText type="defaultSemiBold" style={{ color: "grey" }}>
            Search anything you want.
          </ThemedText>
        </View>
      )}
      <FilterModal
        onApply={onApplyFilters}
        bottomSheetModalRef={bottomSheetModalRef}
      />
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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
});
export default search;
