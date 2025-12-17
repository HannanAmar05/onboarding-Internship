import axios from "axios";
import { axiosConfig } from "./config";

import { TokenStore } from "../auth/token-store";

export const api = axios.create(axiosConfig);

api.interceptors.request.use((config) => {
    const token = TokenStore.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
