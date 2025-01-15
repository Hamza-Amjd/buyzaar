import axios from "axios";


export const setUserService = async (userId:any) => {
    await axios
        .post(`https://buyzaar.vercel.app/api/users`, {
            userId: userId,
        })
        .catch((err) => console.log(err));
}
