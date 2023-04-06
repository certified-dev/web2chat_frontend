import { AxiosRequestHeaders } from "axios";

export default function authHeader(): AxiosRequestHeaders {
    const localstorageUser = localStorage.getItem("user");
    if (!localstorageUser) {
        // @ts-ignore
        return {};
    }
    const user = JSON.parse(localstorageUser);
    if (user && user.token) {
        // @ts-ignore
        return { Authorization: `Token ${user.token}` };
    }
    // @ts-ignore
    return {};
}