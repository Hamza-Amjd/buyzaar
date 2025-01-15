import axios from "axios";
import { useAddressStore } from "../addressStore";

const endpoint = "https://buyzaar.vercel.app/api";

export const fetchaddresses = async (userId: any) => {
    const { setAddresses } = useAddressStore.getState()
    await axios
        .get(`https://buyzaar.vercel.app/api/users/address/${userId}`)
        .then((response) => setAddresses(response.data.addresses))
        .catch((err) => console.log(err))
};


export const DeleteAddressService = async (userId: any, addressId: any) => {
    try {
        const res = await fetch(`${endpoint}/users/address`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: userId,
            addressId: addressId,
        }),
    })
    if (res.status === 200) {
        fetchaddresses(userId)
    }
    } catch (error) {
        console.log("Delete address error",error)
    } 
};

export const AddAddressService = async (userId: any, address: any) => {
    await axios.post(`${endpoint}/users/address`, {
        userId: userId,
        address: address,
    }).then((res) => {
        fetchaddresses(userId)
    })
};


export const UpdateAddressService = async (userId: any, addressId: string, addressData: any) => {
    const { setAddresses } = useAddressStore.getState()
    await axios.put(`${endpoint}/users/address`, {
        userId: userId,
        addressId: addressId,
        updatedAddress: addressData,
    }).then((res) => {
        fetchaddresses(userId);
    })
};