import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Address {
  _id: string;
  title:string;
  address: string;
  "coordinates": {"latitude": number, "longitude": number}
  city: string;
  phoneNumber: string;
}

interface DefaultAddressStore {
  defaultAddress: Address | null;
  setDefaultAddress: (address: Address) => void;
  clearDefaultAddress: () => void;
}

export const useDefaultAddress = create<DefaultAddressStore>()(
  persist(
    (set) => ({
      defaultAddress: null,
      setDefaultAddress: (address) => set({ defaultAddress: address }),
      clearDefaultAddress: () => set({ defaultAddress: null }),
    }),
    {
      name: 'default-address-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
