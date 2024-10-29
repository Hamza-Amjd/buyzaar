import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"

export const getCollections = async () => {
  const collections = await axios.get(`https://buyzaar-admin.vercel.app/api/collections`).then((response) =>{return response.data}).catch((error) =>(console.error(error)));
  return collections
}

export const getCollectionDetails = async (collectionId: string) => {
  const collection = await axios.get(`https://buyzaar-admin.vercel.app/api/collections/${collectionId}`).then((response) =>{return response.data}).catch((error) =>(console.error(error)));
  return collection
}

export const getProducts = async () => {
  const products = await axios.get(`https://buyzaar-admin.vercel.app/api/products`).then((response) =>{return response.data}).catch((error) =>(console.error(error)));
  return products
}

export const getProductDetails = async (productId: string) => {
  const product = await fetch(`https://buyzaar-admin.vercel.app/api/products/${productId}`)
  return await product.json()
}

export const getSearchedProducts = async (query: string) => {
  const searchedProducts = await axios.get(`https://buyzaar-admin.vercel.app/api/search/${query}`).then((response) =>{return response.data}).catch((error) =>(console.error(error)));
  return searchedProducts
}

export const getOrders = async (customerId: string) => {
  const orders = await fetch(`https://buyzaar-admin.vercel.app/api/orders/customers/${customerId}`)
  return await orders.json()
}

export const getRelatedProducts = async (productId: string) => {
  const relatedProducts = await axios.get(`https://buyzaar-admin.vercel.app/api/products/${productId}/related`).then((response) =>{return response.data}).catch((error) =>(console.error(error)));
  return relatedProducts
}
