import { requestor } from "..";

export const updateUser = async (user: any) => (await requestor.put(`user/${user.email}`,user)).data