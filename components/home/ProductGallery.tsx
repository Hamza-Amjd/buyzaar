import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import React, { useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import EnhancedImageViewing from "react-native-image-viewing/dist/ImageViewing";
import { Colors } from "@/constants/Colors";
import CustomSafeAreaView from "../ui/CustomSafeAreaView";

const width = Dimensions.get("screen").width;

const ProductGallery = ({ media }: { media: any }) => {
  const colorScheme = useColorScheme();
  const [showImageModal, setshowImageModal] = useState(false);
  const [selectedImageIndex, setSeletedImageIndex] = useState(0);
  return (
    <>
      <View style={{ width: width, height: 393 }}>
        <Carousel
          width={width}
          height={393}
          data={media}
          onSnapToItem={(index) => setSeletedImageIndex(index)}
          renderItem={({ item, index }) => (
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              key={index}
              onPress={() => {
                setshowImageModal(true);
              }}
            >
              <Image style={{ flex: 1 }} source={{ uri: item as string }} />
            </TouchableWithoutFeedback>
          )}
        />
        <View style={styles.galleryContainer}>
          {media.map((img: string, i: number) => (
            <Image
              style={[
                styles.galleryImg,
                {
                  borderWidth: selectedImageIndex == i ? 1.5 : 0.3,
                },
              ]}
              key={img}
              source={{ uri: img }}
            />
          ))}
        </View>
      </View>
      <View style={{flex:1}}>
        <EnhancedImageViewing
          animationType="slide"
          presentationStyle="fullScreen"
          swipeToCloseEnabled
          backgroundColor={Colors[colorScheme ?? "light"].background2}
          imageIndex={selectedImageIndex}
          visible={showImageModal}
          onRequestClose={() => setshowImageModal(false)}
          images={[
            ...media.map((img: any) => {
              return { uri: img };
            }),
          ]}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  galleryContainer: {
    flexDirection: "row",
    gap: 2,
    position: "absolute",
    bottom: 20,
    right: 10,
  },
  galleryImg: {
    width: 50,
    height: 50,
    borderColor: "black",
    borderRadius: 3,
  },
});

export default ProductGallery;
