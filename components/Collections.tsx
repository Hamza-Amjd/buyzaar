import {
  Dimensions,
  Image,
  Linking,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import { Link } from "expo-router";
import { getCollections } from "@/utils/actions";
import { Colors } from "@/constants/Colors";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const Collections = () => {
  const colorScheme = useColorScheme();

  const [collections, setCollections] = useState([]);
  const [paginationIndex, setPaginationIndex] = useState(0);

  useEffect(() => {
    getCollections().then((collections) =>setCollections(collections));
  }, []);

  

  const width = Dimensions.get("window").width;
  return (
    <View>
      <Carousel
        loop
        width={width}
        height={width / 1.8}
        autoPlay={true}
        pagingEnabled
        onSnapToItem={(index) => setPaginationIndex(index)}
        data={collections}
        scrollAnimationDuration={2000}
        renderItem={({ item }: { item: any }) => (
          <Link href={`/collections/${item._id}`} asChild>
            <TouchableOpacity style={{ flex: 1 }}>
              <Image style={{ flex: 1 }} source={{ uri: item.image }} />
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
};

export default Collections;
