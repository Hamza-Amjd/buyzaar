import axios from "axios";
import { BASE_URL } from "./config";


export const setUserService = async (userId:any) => {
    await axios
        .post(`${BASE_URL}/users`, {
            userId: userId,
        })
        .catch((err) => console.log(err));
}
