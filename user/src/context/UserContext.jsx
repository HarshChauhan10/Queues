import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, setToken] = useState(() => localStorage.getItem("token") || "");

    const authHeaders = () => ({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const [userQueuePosition, setUserQueuePosition] = useState(null);

    const joinQueue = async (instituteId) => {
        const res = await axios.post('/queue/join', { instituteId });
        return res.data;
    };

    const leaveQueue = async (instituteId) => {
        const res = await axios.post('/queue/leave', { instituteId });
        return res.data;
    };

    const getUserQueuePosition = async (instituteId) => {
        const res = await axios.get(`/queue/position/${instituteId}`);
        setUserQueuePosition(res.data);
        return res.data;
    };

    // 🔐 Register
    const register = async (formData) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/user/register`, formData);
            const { user, token } = res.data;
            setUser(user);
            setToken(token);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
        } catch (err) {
            console.error("Register error:", err?.response?.data?.error || err.message);
            throw err;
        }
    };

    // 🔓 Login
    const login = async (credentials) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/user/login`, credentials);
            const { user, token } = res.data;
            setUser(user);
            setToken(token);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
        } catch (err) {
            console.error("Login error:", err?.response?.data?.error || err.message);
            throw err;
        }
    };

    // ✅ Complete Profile
    const completeProfile = async (data) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/user/complete-profile`, data, authHeaders());
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (err) {
            console.error("Complete profile error:", err?.response?.data?.error || err.message);
            throw err;
        }
    };

    // 👀 Get name & email
    const getNameAndEmail = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/user/name-email`, authHeaders());
            return res.data.user;
        } catch (err) {
            console.error("Get name/email error:", err?.response?.data?.error || err.message);
            throw err;
        }
    };

    // 📦 Fetch rest of profile
    const fetchUserProfile = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/user/profile`, authHeaders());
            const updatedUser = { ...user, ...res.data.user };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (err) {
            console.error("Fetch profile error:", err?.response?.data?.error || err.message);
            throw err;
        }
    };

    // ✏️ Update profile (excluding name/email/password)
    const updateProfile = async (updates) => {
        try {
            const res = await axios.put(`${BASE_URL}/api/user/update-profile`, updates, authHeaders());
            const updatedUser = { ...user, ...res.data.user };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (err) {
            console.error("Update profile error:", err?.response?.data?.error || err.message);
            throw err;
        }
    };

    // 🚪 Logout
    const logout = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    // 🎯 Auto-fetch user data when token is present
    useEffect(() => {
        if (token) {
            fetchUserProfile().catch(() => logout());
        }
    }, [token]);

    return (
        <UserContext.Provider
            value={{
                user,
                token,
                register,
                login,
                completeProfile,
                getNameAndEmail,
                fetchUserProfile,
                updateProfile,
                logout, joinQueue, leaveQueue, getUserQueuePosition, userQueuePosition,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
