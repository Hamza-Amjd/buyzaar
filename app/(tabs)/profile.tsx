import { Image, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator, useColorScheme, Linking } from 'react-native'
import React, {useEffect,useState} from 'react'
import { Colors } from "@/constants/Colors";
import { useNavigation } from '@react-navigation/native'
import { Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ThemedText } from '@/components/ThemedText';
import { Link, router, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';


const profile = () => {
    const colorScheme=useColorScheme();
    const [userLogin, setUserLogin] = useState(false)
    const [userData, setUserData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const checkUserExist=async()=>{
        const token=await AsyncStorage.getItem('token')
        if(token!==null){
            setLoading(true)
            setUserLogin(true)

        try {
            const response = await fetch(`https://buyzaar-backend.vercel.app/api/auth/getuser`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token":token
            }
          });
          const json =await response.json();
          setUserData(json)
          setLoading(false)
        } catch (error) {
            console.log(error)
        }
        
    }
    }
    const logout=()=>{
        Alert.alert(
            'Logout','Are you sure you want to logout',
            [{text:'Cancel',onPress:()=>{}},{text:'Confirm',onPress:async()=>{await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('userId');
            setUserLogin(false);setUserData([])}}]);
      }
    
    useEffect(() => {
      checkUserExist()
    }, [])
    const menuitems=[
        {name:'Wishlist' ,icon:'bookmark-sharp',"function":()=>router.push('/wishlist')},
        {name:'Cart' ,icon:'cart',"function":()=>router.push('/cart')},
        {name:'Orders' ,icon:'bag',"function":()=>router.push('/orders')},
        {name:'To Review' ,icon:'star',"function":()=>router.push('/orders')},
        {name:'Payment info' ,icon:'card',"function":null},
        {name:'Settings' ,icon:'settings',"function":null},
        {name:'Privacy policy' ,icon:'shield-checkmark',"function":()=>Linking.openURL('https://www.google.com/')},
        {name:'Log out' ,icon:'log-out',"function":logout},
    ]
  return (
    <ThemedView style={styles.container}>
        <View style={styles.userDetails}>
        <Image style={styles.dp} source={require('@/assets/images/userDefault.png')}/>
        {loading? <ActivityIndicator style={{height:100}}/>:
        userLogin?
        
        <View style={{height:100,alignItems:'center',justifyContent:'center'}} >
            <View style={{borderColor:Colors[colorScheme ?? 'light'].text,
            borderWidth:2,
            borderRadius:25,
            padding:10}}>
                <ThemedText type='subtitle' >{userData.name}</ThemedText>
            </View>
            <View style={{flexDirection:"row"}}>
                <ThemedText type='defaultSemiBold'>{userLogin && userData.email}</ThemedText>
                {userData.verified && <MaterialIcons name="verified-user" size={24} color="cyan" />}
            </View>
        </View>:
        <TouchableOpacity style={{borderColor:Colors[colorScheme ?? 'light'].text,
        borderWidth:2,
        borderRadius:25,
        padding:10}} onPress={()=>router.push("/(auth)")}>
            <ThemedText type='subtitle'>Signup to your account</ThemedText>
        </TouchableOpacity>
        }
        
        </View> 
         
        <View style={styles.menu}>
            {/* @ts-ignore */}
            {menuitems.map((menu,index) => {return <TouchableOpacity key={index} onPress={menu.function} style={[styles.menuItem,{backgroundColor:Colors[colorScheme ?? 'light'].background2}]}>
                {/* @ts-ignore */}
                <Ionicons name={menu.icon} size={25} color={Colors[colorScheme ?? 'light'].text}/>
                <ThemedText type='subtitle' >   {menu.name}</ThemedText>
            </TouchableOpacity>})}
        </View>
    </ThemedView>
  )
}

export default profile

const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingVertical:20,
        paddingHorizontal:10,
    },
    userDetails: {
        justifyContent:'center',
        alignItems:'center',
        marginTop:50,
        height:200
    },
    dp:{
          width:100,
          height:100,
          bottom:10,
          borderRadius:100
    },
    menu:{
       alignItems:'flex-start',
       marginTop:50
    },
    menuItem: {padding:5,borderRadius:10,
        width:'100%',
        marginBottom:10,
        flexDirection:'row',
    },
})