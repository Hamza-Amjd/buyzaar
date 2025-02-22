// import { GoogleSignin } from "@react-native-google-signin/google-signin";
// import axios from "axios";
// import { router } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useClerk, useOAuth, useSignIn } from "@clerk/clerk-expo";

// GoogleSignin.configure({
//     webClientId:"985275296337-5m1emcdjn0ivlssabp2u3o1qk8gaeipp.apps.googleusercontent.com",
//     forceCodeForRefreshToken: true,
//     offlineAccess: false,
//     iosClientId: "",
//   });
  

//   export const signInWithGoogle = async () => {
//     // const clerk=useClerk();
//     try {
//       await GoogleSignin.hasPlayServices();
//       await GoogleSignin.signOut();
//       const res = await GoogleSignin.signIn();
//       console.log(res);
      

//     } catch (error: any) {
//       console.log(error);
//     }
//   }

//   const handleGoogleSignIn = React.useCallback(async () => {
//     try {
//       const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
//         redirectUrl: Linking.createURL('/(tabs)', { scheme: "buyzaar" }),
//       })

//       if (createdSessionId) {
//         setActive!({ session: createdSessionId })
//       } else {
        
//       }
//     } catch (err) {
//       console.error('OAuth error', err)
//     }
//   }, [])
//  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

// export const useWarmUpBrowser = () => {
//     useEffect(() => {
//       void WebBrowser.warmUpAsync();
//       return () => {
//         void WebBrowser.coolDownAsync();
//       };
//     }, []);
//   };
  
//   WebBrowser.maybeCompleteAuthSession();

//useWarmUpBrowser();
//    // const response=await axios.post('http://192.168.0.109:3000/api/mobile/oauth',{idToken: data?.idToken})

// GoogleSignin.configure({
//     webClientId:"985275296337-5m1emcdjn0ivlssabp2u3o1qk8gaeipp.apps.googleusercontent.com",
//     forceCodeForRefreshToken: true,
//     offlineAccess: false,
//   });

//   const signInWithGoogle = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       await GoogleSignin.signOut();
//       const {data,type} = await GoogleSignin.signIn();

//       if(data?.idToken){
//         const signInOrUp = await clerk.authenticateWithGoogleOneTap({  token: data?.idToken })
//         // Set the session as active, and handle any navigation or redirects
//         await clerk.handleGoogleOneTapCallback(
//           signInOrUp,
//           { redirectUrl: Linking.createURL('/(tabs)') }
//         )
//       }
//     } catch (error:any) {
//       console.log( error.errors)
//     }
//   }