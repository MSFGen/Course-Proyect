import { api } from "./axios";


export const AuthService = {
    async login(user: string, password: string) {
        const send = {
            user: user,
            password: password
        };
        const response = await api.post('/auth/login', send);
        return response.data;
    },
}