import { Link, Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  useColorScheme,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";

import Animated, {
  FadeIn,
  FadeOut,
  BounceInRight,
  SlideOutLeft,
  BounceOutLeft,
  SlideInRight,
  runOnJS,
} from "react-native-reanimated";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
//@ts-ignore
import onboarding1 from "@/assets/images/onboarding1.png";import onboarding2 from "@/assets/images/onboarding2.png";import onboarding3 from "@/assets/images/onboarding3.png";

const onboardingSteps = [
  {
    icon: onboarding1,
    title: "Welcome to Buyzaar",
    description: "Your gateway to the best products at unbeatable prices.",
  },
  {
    icon: onboarding2,
    title: "Discover Products You'll Love",
    description: "Find exactly what you need in just a few taps.",
  },
  {
    icon: onboarding3,
    title: "Easy & Secure Checkout",
    description: "Shop confidently with our fast and secure checkout process",
  },
];

export default function onboarding() {
  const colorScheme = useColorScheme();
  const [screenIndex, setScreenIndex] = useState(0);

  const data = onboardingSteps[screenIndex];

  const onContinue = () => {
    'worklet';
    const isLastScreen = screenIndex === onboardingSteps.length - 1;
    if (isLastScreen) {
      runOnJS(endOnboarding)();
    } else {
      runOnJS(setScreenIndex)(screenIndex + 1);
    }
  };

  const onBack = () => {
    'worklet';
    const isFirstScreen = screenIndex === 0;
    if (isFirstScreen) {
      runOnJS(endOnboarding)();
    } else {
      runOnJS(setScreenIndex)(screenIndex - 1);
    }
  };

  const endOnboarding = async() => {
    await AsyncStorage.setItem("isFirstStart", "false");
    router.replace("/(auth)");
  };

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().direction(Directions.LEFT).onEnd(onContinue),
    Gesture.Fling().direction(Directions.RIGHT).onEnd(onBack)
  );

  return (
    <ThemedView style={styles.page}>
      <GestureDetector gesture={swipes}>
        <View style={styles.pageContent} key={screenIndex}>
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Image
              source={data.icon}
              style={styles.image}
            />
          </Animated.View>

          <View style={styles.footer}>
            <Animated.Text
              entering={SlideInRight}
              exiting={SlideOutLeft}
              style={[
                styles.title,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
            >
              {data.title}
            </Animated.Text>
            <Animated.Text
              entering={SlideInRight.delay(50)}
              exiting={SlideOutLeft}
              style={styles.description}
            >
              {data.description}
            </Animated.Text>

            <View style={{ paddingTop: 80 }}>
              {onboardingSteps[screenIndex].title ==
              "Easy & Secure Checkout" ? (
                <TouchableOpacity onPress={endOnboarding}
                  style={{
                    width: 55,
                    height: 55,
                    backgroundColor: Colors[colorScheme ?? "light"].primary,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                >
                  <FontAwesome5 name="arrow-right" size={40} color={"white"} />
                </TouchableOpacity>
              ) : (
                <View style={styles.stepIndicatorContainer}>
                  {onboardingSteps.map((step, index) => {
                    return (
                      <View
                        key={index}
                        style={[
                          styles.stepIndicator,
                          {
                            backgroundColor:
                              index === screenIndex
                                ? Colors[colorScheme ?? "light"].primary
                                : "grey",
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        </View>
      </GestureDetector>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  pageContent: {
    padding: 20,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: 1.3,
    marginVertical: 10,
  },
  description: {
    color: "gray",
    fontSize: 18,
    lineHeight: 20,
  },
  footer: {
    marginTop: 30,
  },

  buttonsRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  button: {
    backgroundColor: "#302E38",
    borderRadius: 50,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: "#FDFDFD",
    fontSize: 16,

    padding: 15,
    paddingHorizontal: 25,
  },

  // steps
  stepIndicatorContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  stepIndicator: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "gray",
  },
});
