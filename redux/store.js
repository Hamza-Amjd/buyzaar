import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./CartReducer";
import FavorateReducer from "./FavorateReducer";

export default configureStore({
    reducer:{
        cart:CartReducer,
        favorite:FavorateReducer
    }
})