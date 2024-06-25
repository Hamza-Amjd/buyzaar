import { createSlice } from "@reduxjs/toolkit";

export const cartSlice=createSlice({
    name:"cart",
    initialState:{
        cart:[],
    },
    reducers:{
        addToCart:(state,action)=>{
            const itemInCart=state.cart.find((item)=>item._id==action.payload._id)
            if (itemInCart){
                itemInCart.quantity++
            }else{
                state.cart.push({...action.payload,quantity:1})
            }
        },
        removeFromCart:(state,action)=>{
            const removeFromCart=state.cart.filter((item)=>item._id!==action.payload._id)
            state.cart=removeFromCart
        },
        incrementQuantity:(state,action)=>{
            const itemInCart=state.cart.find((item)=>item._id==action.payload._id)
            itemInCart.quantity++
        },
        decrementQuantity:(state,action)=>{
            const itemInCart=state.cart.find((item)=>item._id==action.payload._id)
            if (itemInCart.quantity==1){
                const removeFromCart=state.cart.filter((item)=>item._id!==action.payload._id)
                state.cart=removeFromCart
            }else{
                itemInCart.quantity--
            }
        },
        clearCart:(state)=>{
            state.cart=[];
        },
    }
})

export const {addToCart,removeFromCart,incrementQuantity,decrementQuantity,clearCart}=cartSlice.actions;
export default cartSlice.reducer;