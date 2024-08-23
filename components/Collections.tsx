import {
  Dimensions,
  Image,
  Linking,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import Carousel from "react-native-reanimated-carousel";
import axios from "axios";
import { Link } from "expo-router";
import { getCollections } from "@/utils/actions";

const Collections = () => {
  const [collections, setCollections] = useState([]);
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
        data={collections}
        scrollAnimationDuration={1000}
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
