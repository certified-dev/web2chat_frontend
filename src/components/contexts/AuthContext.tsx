import axios, {AxiosInstance} from "axios";
import React, {createContext, ReactNode, useState} from "react";
import {useNavigate} from "react-router-dom";

import {UserModel} from "../models/User";
import authHeader from "../services/AuthHeaders";
import AuthService from "../services/AuthService";
import {ConversationModel} from "../models/Conversation";

const DefaultProps = {
    login: () => null,
    logout: () => null,
    signup: () => null,
    authAxios: axios,
    user: null
};

export interface AuthProps {
    login: (username: string, password: string) => any;
    logout: () => void;
    signup: (firstName: string, lastName: string, email: string, username: string, password: string) => any;
    authAxios: AxiosInstance;
    user: UserModel | null;
}

export const AuthContext = createContext<AuthProps>(DefaultProps);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => AuthService.getCurrentUser());

    async function login(username: string, password: string) {
        const data = await AuthService.login(username, password);
        setUser(data);
        return data;
    }

    function logout() {
        AuthService.logout(user?.token);
        setUser(null);
        navigate("/login");
        localStorage.removeItem("user");
        localStorage.removeItem("conversation");
    }

    async function signup(firstName: string, lastName: string, email: string, username: string, password: string) {
        const data = await AuthService.signup(firstName, lastName, email, username, password)
        setUser(data);
        return data;
    }

    // axios instance for making requests
    const authAxios = axios.create();

    // request interceptor for adding token
    authAxios.interceptors.request.use((config) => {
        // add token to request headers
        config.headers = authHeader();
        return config;
    });

    authAxios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response.status === 401) {
                logout();
            }
            return Promise.reject(error);
        }
    );

    return (
        <AuthContext.Provider value={{user, signup, login, logout, authAxios}}>
            {children}
        </AuthContext.Provider>
    );
};