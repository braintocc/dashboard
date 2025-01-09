import { requestor } from "..";

export const getUser = async (email: string) => (await requestor.get(`user/${email}`)).data