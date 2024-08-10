import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import {createContext} from "react";
//@ts-ignore
const Usercontext = createContext();

type userprops={
    children:any
}

const UserProvider:React.FC<userprops> = ({children}) => {
    const [userInfo, setUserInfo] = useState(null)
  return (
    <Usercontext.Provider
      value={{userInfo, setUserInfo}}
    >
    </Usercontext.Provider>
  )
}

export default {Usercontext,UserProvider};
