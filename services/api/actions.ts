import axios from "axios"
export const EXPO_PUBLIC_BASE_URL='https://buyzaar-admin.vercel.app/api'

export const getCollections = async () => {
  const collections = await axios.get(`${EXPO_PUBLIC_BASE_URL}/collections`).then((response) =>{return response.data}).catch((error) =>(console.error(error)));
  return collections
}

export const getCollectionDetails = async (collectionId: string) => {
  const collection = await axios.get(`${EXPO_PUBLIC_BASE_URL}/collections/${collectionId}`).then((response) =>{return response.data}).catch((error) =>(console.error(error)));
  return collection
}

export const getProducts = async () => {
  const products = await axios.get(`${EXPO_PUBLIC_BASE_URL}/products`).then((response) =>{return response.data}).catch((error) =>(console.error(error)));
  return products
}

export const getProductDetails = async (productId: string) => {
  const product = await fetch(`${EXPO_PUBLIC_BASE_URL}/products/${productId}`)
  return await product.json()
}

export const getSearchedProducts = async (query: string,minPrice='0',maxPrice='2000000') => {
  const searchedProducts = await axios.get(`${EXPO_PUBLIC_BASE_URL}/search/${query}?minPrice=${minPrice}&maxPrice=${maxPrice}`).then((response) =>{return response.data}).catch((error) =>(console.error(error)));
  return searchedProducts
}

export const getOrders = async (customerId: string) => {
  const orders = await fetch(`${EXPO_PUBLIC_BASE_URL}/orders/customers/${customerId}`)
  return await orders.json()
}

export const getRelatedProducts = async (productId: string) => {
  const relatedProducts = await axios.get(`${EXPO_PUBLIC_BASE_URL}/products/${productId}/related`).then((response) =>{return response.data}).catch((error) =>(console.error(error)));
  return relatedProducts
}
