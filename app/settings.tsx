import {
  Appearance,
  ColorSchemeName,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import Header from "@/components/Header";
import { useUser } from "@clerk/clerk-expo";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import CenterModal from "@/components/CenterModal";

const settings = () => {
  const colorScheme = useColorScheme();
  const { user } = useUser();
  const [themeModal, setThemeModal] = useState(false)
  const SETTING = [
    {
      header: "Display",
      items: [{ name: "Theme", iconName: "sunny", function: ()=>setThemeModal(true) }],
    },
  ];
  function handleColorScheme(theme:ColorSchemeName) {
    Appearance.setColorScheme (theme);
    setThemeModal(false)
    }
  return (
    <ThemedView
      style={{ flex: 1, gap: 10 }}
    >
      <Header title="Settings"/>
      <View style={styles.userInfo}>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <Image
            source={{ uri: user?.imageUrl }}
            style={{ width: 70, height: 70, borderRadius: 70 }}
          />
          <View
            style={{ justifyContent: "space-between", paddingVertical: 10 }}
          >
            <ThemedText type="defaultSemiBold">{user?.fullName}</ThemedText>
            <ThemedText type="default">
              {user?.emailAddresses[0].emailAddress}
            </ThemedText>
          </View>
        </View>

        <Ionicons
          name="qr-code"
          style={{ color: Colors[colorScheme ?? "light"].text, fontSize: 30 }}
        />
      </View>
      {SETTING.map((item, index) => {
        return (
          <View key={index} style={{ padding: 10 }}>
            <ThemedText type="default">{item.header}</ThemedText>

            {item.items.map((subitem, index) => (
              <TouchableOpacity
                key={index}
                style={styles.itemConatiner}
                onPress={subitem.function}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Ionicons
                    name={subitem.iconName as any}
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                  />
                  <ThemedText type="subtitle">{subitem.name}</ThemedText>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={25}
                  color={Colors[colorScheme ?? "light"].text}
                  style={{}}
                />
              </TouchableOpacity>
            ))}
          </View>
        );
      })}
      <CenterModal isVisible={themeModal} onClose={()=>setThemeModal(false)} width={'50%'}>
        <View style={{justifyContent:'flex-start',width:'100%',gap:10}}>
          <TouchableOpacity style={styles.themeButton} onPress={()=>handleColorScheme('light')}>
            <Ionicons name="sunny-outline" size={24} color={Colors[colorScheme ?? "light"].text} />
            <ThemedText type="default">Light</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.themeButton} onPress={()=>handleColorScheme('dark')}>
            <Ionicons name="moon-outline" size={24} color={Colors[colorScheme ?? "light"].text} />
            <ThemedText type="default">Dark</ThemedText>
          </TouchableOpacity> 
        </View>
      </CenterModal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    borderBottomWidth: 0.5,
    borderColor: "grey",
  },
  itemConatiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: 15,
  },
  themeButton:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius:10,
  }
});

export default settings;