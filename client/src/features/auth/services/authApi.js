import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

export async function register({ username, email, password }) {
    try {
        const response = await api.post(
            "/api/auth/register",
            {
                username,
                email,
                password,
            },
            {
                withCredentials: true,
            }
        );

        return response.data;
    } catch (err) {
        console.log("ERROR:", err);
        console.log("Response:", err.response?.data);
        throw err;
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post(
            "/api/auth/login",
            {
                email,
                password,
            },
            {
                withCredentials: true,
            }
        );

        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout", {
            withCredentials: true,
        });

        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me", {
            withCredentials: true,
        });

        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}