import { requestor } from "..";

export const createUser = async (email: string) => (await requestor.post(`user`,{
    email,
    subscription: { level: "free" },
    sources:{},
    destinations: {},
    mappings: [],
})).data