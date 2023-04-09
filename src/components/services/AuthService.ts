import axios from "axios";

import {UserModel} from "../models/User";

class AuthService {
    setUserInLocalStorage(data: UserModel) {
        localStorage.removeItem("user");
        localStorage.removeItem("conversation");
        localStorage.setItem("user", JSON.stringify(data));
    }

    async signup(first_name: string, last_name: string, email: string, username: string, password: string): Promise<UserModel> {
        const response = await axios.post("http://127.0.0.1:8000/api/user/add", {
            first_name,
            last_name,
            email,
            username,
            password
        });
        if (!response.data.token) {
            return response.data;
        }
        this.setUserInLocalStorage(response.data);
        return response.data;
    }

    async login(username: string, password: string): Promise<UserModel> {
        const response = await axios.post("http://127.0.0.1:8000/auth-token/", {username, password});
        if (!response.data.token) {
            return response.data;
        }
        this.setUserInLocalStorage(response.data);
        return response.data;
    }

    async logout(user_token: string) {
        const id = JSON.parse(localStorage.getItem("conversation")!).id;
        await axios.post("http://127.0.0.1:8000/api/user/logout",
            {id},{
                headers: {
                    Authorization: `Token ${user_token}`
                }
            }
        );
    }

    getCurrentUser() {
        const user = localStorage.getItem("user")!;
        return JSON.parse(user);
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new AuthService();