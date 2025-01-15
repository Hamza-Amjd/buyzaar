import {
  StyleSheet,
  View,
  FlatList,
  Animated,
  useColorScheme,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useCallback, useState } from "react";
import { ThemedView } from "@/components/ui/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import Header from "@/components/ui/Header";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const NotificationItem = ({ item }: any) => {
  return (
    <Animated.View style={styles.notificationItem}>
      <View style={styles.titleRow}>
        <ThemedText type="mediumSemiBold">{item.title}</ThemedText>
        <ThemedText type="default" style={{ fontSize: 12, color: "grey" }}>
          {new Date(item.date).toLocaleString()}
        </ThemedText>
      </View>
      <ThemedText type="defaultSemiBold" style={{ color: "#eeeade" }}>
        {item.body}
      </ThemedText>
    </Animated.View>
  );
};

const messages = () => {
  const colorScheme = useColorScheme();
  const [notifications, setNotifications] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchNotifications = async () => {
        try {
          const storedNotifications = await AsyncStorage.getItem(
            "notifications"
          );
          if (storedNotifications) {
            setNotifications(JSON.parse(storedNotifications).reverse());
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchNotifications();
    }, [])
  );
  const handleClearNotications = () => {
    Alert.alert(
      "Clear notifications?","",
      [
        { text: "Cancel" },
        {
          text: "Confirm",
          onPress: () => {
            AsyncStorage.removeItem("notifications");
            setNotifications([]);
          },
        },
      ]
    );
  };
  return (
    <ThemedView style={styles.container}>
      <Header
        showBackButton={false}
        title="Notifications"
        headerRight=<TouchableOpacity onPress={handleClearNotications}>
          <MaterialCommunityIcons
            name="notification-clear-all"
            size={30}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
      />
      <FlatList
        data={notifications}
        renderItem={NotificationItem}
        ListEmptyComponent={()=>
            <View style={styles.emptyListContainer}>
                    <Ionicons name="notifications" 
            size={60}
            color={Colors[colorScheme ?? "light"].text}/>
                    <ThemedText type="mediumSemiBold" style={{textAlign:'center'}}>No notifications yet</ThemedText>
                
            </View>
        }
        //@ts-ignore
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 15, gap: 10 }}
      />
    </ThemedView>
  );
};

export default messages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyListContainer:{
    marginTop:"80%",
    justifyContent:"center",
    alignItems:"center",
    textAlign:'center'
  },
  notificationItem: {
    padding: 10,
    borderRadius: 10,
    gap: 20,
    backgroundColor: Colors.dark.background2,
  },
  titleRow: {
    width: "99%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  notificationText: {
    fontSize: 16,
  },
});
