import { requestor } from "..";


export const getPodcasts = async (token: string) => (await requestor.get(`podcasts`, {
    headers: {
        'authorization-notion': token,
    }
})).data;
