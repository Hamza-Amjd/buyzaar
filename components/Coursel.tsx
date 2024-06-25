import { Dimensions, Image, Linking, TouchableOpacity, View} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import Carousel from 'react-native-reanimated-carousel';


const Coursel = () => {
  const slides = [
    'https://img.freepik.com/free-psd/special-deal-super-offer-upto-60-parcent-off-isolated-3d-render-with-editable-text_47987-15330.jpg?t=st=1691340744~exp=1691341344~hmac=121cdf6682b05cfdc8ab3fbb452d8dfa30ea59cc12f65ffa93a852410eae55e6',
    "https://joburg.co.za/wp-content/uploads/2020/08/641.jpg.webp",
    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  ];
  const width = Dimensions.get('window').width;
  return (
    <View>
      <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                data={slides}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => (
                  <TouchableOpacity style={{flex:1}} onPress={()=>{Linking.openURL(item)}}>
                    <Image style={{flex:1}} source={{uri:item}} />
                  </TouchableOpacity>
                )}
            />
    </View>
  );
};

export default Coursel;
