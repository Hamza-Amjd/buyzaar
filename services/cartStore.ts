import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {ToastAndroid} from "react-native"

import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CartItem {
  item: ProductType;
  quantity: number;
  color?: string; 
  size?: string; 
}

interface CartStore {
  cartItems: CartItem[];
  wishlist: ProductType[];
  addItem: (item: CartItem) => void;
  removeItem: (idToRemove: string) => void;
  increaseQuantity: (idToIncrease: string) => void;
  decreaseQuantity: (idToDecrease: string) => void;
  clearCart: () => void;
  toggleWishlist:(item: ProductType) => void;
}

const useCartStore = create(
  persist<CartStore>(
    (set, get) => ({
      cartItems: [],
      wishlist:[],
      addItem: (data: CartItem) => {
        const { item, quantity, color, size } = data;
        const currentItems = get().cartItems; // all the items already in cart
        const isExisting = currentItems.find(
          (cartItem) => cartItem?.item?._id === item._id
        );

        if (isExisting) {
          return ToastAndroid.showWithGravity(
            "Item already in cart",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }

        set({ cartItems: [...currentItems, { item, quantity, color, size }] });
        ToastAndroid.showWithGravity(
          "Item added to cart",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      },
      removeItem: (idToRemove: String) => {
        const newCartItems = get().cartItems.filter(
          (cartItem) => cartItem.item._id !== idToRemove
        );
        set({ cartItems: newCartItems });
        ToastAndroid.showWithGravity(
          "Item removed from cart",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      },
      increaseQuantity: (idToIncrease: String) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.item._id === idToIncrease
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        set({ cartItems: newCartItems });
        ToastAndroid.showWithGravity(
          "Item quantity increased",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      },
      decreaseQuantity: (idToDecrease: String) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.item._id === idToDecrease
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
        set({ cartItems: newCartItems });
        ToastAndroid.showWithGravity(
          "Item quantity decreased",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      },
      clearCart: () => set({ cartItems: [] }),
      toggleWishlist: (item: ProductType) => {
        const wishlist = get().wishlist; // all the items already in cart
        const isExisting = wishlist.find(
          (wishlistitem) => wishlistitem?._id === item._id
        );

        if (isExisting) {
          const newWishlist = get().wishlist.filter(
            (wishlistItem) => wishlistItem._id !== item._id
          );
          set({ wishlist: newWishlist });
          return ToastAndroid.showWithGravity(
            "Item removed from wishlist",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }

        set({ wishlist: [...wishlist, item] });
        ToastAndroid.showWithGravity(
          "Item added to wishlist",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCartStore;