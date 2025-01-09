import { requestor } from "..";

export const getSocials = async (token: string) => (await requestor.get(`socials`,{
    headers: {
        'authorization-notion': token,
    }
})).data


