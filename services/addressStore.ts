import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Address {
  _id: string;
  title:string;
  address: string;
  coordinates: {latitude: Number, longitude: Number}
  city: string;
  country: string;
  phoneNumber: string;
}

interface AddressStore {
  addresses: Address[];
  defaultAddress: Address | undefined;
  setAddresses: (addresses: Address[]) => void;
  removeAddresses: ()=>void;
  setDefaultAddress: (address: Address) => void;
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set,get) => ({
      addresses: [],
      defaultAddress: undefined,
      setAddresses: (data) => set({ addresses:data }),
      removeAddresses: () => set({ addresses: [] ,defaultAddress: undefined}),
      setDefaultAddress: (address:any) => set((state) => ({
        defaultAddress: address,
      })),
    }),
    {
      name: 'address-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
