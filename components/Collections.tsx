import {
  Dimensions,
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import { Link } from "expo-router";
import { getCollections } from "@/utils/actions";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const activeIndex = useSharedValue(0);

  useEffect(() => {
    getCollections().then((fetchedCollections) => {
      setCollections(fetchedCollections);
    });
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
        data={collections}
        scrollAnimationDuration={2000}
        autoPlayInterval={5000}
        onSnapToItem={(index) => {
          activeIndex.value = index;
        }}
        renderItem={({ item }: { item: any }) => (
          <Link href={`/collections/${item._id}?image=${item.image}`} asChild>
            <TouchableOpacity style={{width:width-20,height:width / 1.8,alignSelf:'center',borderRadius:10 }}>
              <Image style={{ flex: 1,borderRadius:10 }} source={{ uri: item.image }} />
            </TouchableOpacity>
          </Link>
        )}
      />
      <View style={styles.pagination}>
        {collections.map((_, index) => (
          <AnimatedDot key={index} index={index} activeIndex={activeIndex} />
        ))}
      </View>
    </View>
  );
};
//@ts-ignore
const AnimatedDot = ({ index, activeIndex }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = index === activeIndex.value;
    return {
      width: withTiming(isActive ? 12 : 8, { duration: 200, easing: Easing.linear }),
      height: withTiming(isActive ? 12 : 8, { duration: 200, easing: Easing.linear }),
      backgroundColor: isActive ? 'white' : 'gray',
    };
  });

  return <Animated.View style={[styles.paginationDot, animatedStyle]} />;
};

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position:'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationDot: {
    height: 8,
    marginHorizontal: 4,
    borderRadius:20
  },
});

export default Collections;
