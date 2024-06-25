import { createSlice } from "@reduxjs/toolkit";

export const FavoriteSlice=createSlice({
    name:"favorite",
    initialState:{
        favorite:[],
    },
    reducers:{
        addTofavorite:(state,action)=>{
            const itemInfavorite=state.favorite.find((item)=>item._id==action.payload._id)
            if(itemInfavorite){
                const removeFromfavorite=state.favorite.filter((item)=>item._id!==action.payload._id)
                state.favorite=removeFromfavorite
            }else{
                state.favorite.push({...action.payload})
            }
        },
        removeFromfavorite:(state,action)=>{
            const removeFromfavorite=state.favorite.filter((item)=>item._id!==action.payload._id)
            state.favorite=removeFromfavorite
        },
        
    }
})

export const {addTofavorite,removeFromfavorite}=FavoriteSlice.actions;
export default FavoriteSlice.reducer;