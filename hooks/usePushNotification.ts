import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  fcmToken?: string;
  notification?: Notifications.Notification;
}

export const usePushNotifications = (): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] =
    useState<Notifications.ExpoPushToken>();
  const [fcmToken, setFcmToken] = useState<string>();
  const [notification, setNotification] =
    useState<Notifications.Notification>();

  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: true,
    }),
  });

  async function requestUserPermission() {
    if (Device.isDevice) {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log("Authorization status:", authStatus);
      }
    }
  }

  async function setupFCM() {
    try {
      await requestUserPermission();

      // Get FCM token
      const token = await messaging().getToken();
      setFcmToken(token);
      // console.log('FCM Token:', token);

      // Handle FCM token refresh
      messaging().onTokenRefresh((token: string) => {
        setFcmToken(token);
        console.log("New FCM token:", token);
      });

      // Handle background messages
      messaging().setBackgroundMessageHandler(
        async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
          console.log("Background message:", remoteMessage);
        }
      );

      // Handle foreground messages
      const unsubscribe = messaging().onMessage(
        async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
          console.log("Foreground message:", remoteMessage);
          // Convert FCM message to local notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: remoteMessage.notification?.title || "",
              body: remoteMessage.notification?.body || "",
              data: remoteMessage.data,
            },
            trigger: null,
          });
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("FCM setup error:", error);
    }
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification");
        return;
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  async function saveNotification(notification: Notifications.Notification) {
    try {
      const existingNotifications = await AsyncStorage.getItem("notifications");
      const notificationsList = existingNotifications? JSON.parse(existingNotifications): [];
      notificationsList.push({
        id: notification.request.identifier,
        date: notification.date,
        title: notification.request.content.title,
        body: notification.request.content.body,
      });
      await AsyncStorage.setItem("notifications",JSON.stringify(notificationsList));
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  }

  useEffect(() => {
    let fcmUnsubscribe: (() => void) | undefined;

    const setup = async () => {
      // Setup Expo notifications
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);

      // Setup FCM
      fcmUnsubscribe = await setupFCM();

      // Setup notification listeners
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
          saveNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("Notification response:", response);
        });
    };

    setup();

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
      if (fcmUnsubscribe) {
        fcmUnsubscribe();
      }
    };
  }, []);

  return {
    expoPushToken,
    fcmToken,
    notification,
  };
};
