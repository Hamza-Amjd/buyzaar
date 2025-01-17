import { GoogleSignin } from "@react-native-google-signin/google-signin";
import axios from "axios";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useOAuth, useSignIn } from "@clerk/clerk-expo";

GoogleSignin.configure({
    webClientId:"985275296337-anc1uqerl4kbptjlsotmegr7i7ua3svv.apps.googleusercontent.com",
    forceCodeForRefreshToken: true,
    offlineAccess: false,
    iosClientId: "",
  });
  

  export const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const res = await GoogleSignin.signIn();
      console.log(res.data?.idToken)
    } catch (error: any) {
      console.log(error.response.data);
    }
  }

