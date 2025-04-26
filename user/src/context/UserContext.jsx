import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    // 🔐 Register
    const register = async (formData) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/user/register`, formData);
            const { user, token } = res.data;
            setUser(user);
            setToken(token);
            localStorage.setItem("token", token);
        } catch (err) {
            console.error("Register error:", err?.response?.data || err.message);
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
        } catch (err) {
            console.error("Login error:", err?.response?.data || err.message);
            throw err;
        }
    };

    // ✅ Complete Profile
    const completeProfile = async (data) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/user/complete-profile`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(res.data.user);
        } catch (err) {
            console.error("Complete profile error:", err?.response?.data || err.message);
            throw err;
        }
    };

    // 👀 Get name & email
    const getNameAndEmail = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/user/name-email`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data.user;
        } catch (err) {
            console.error("Get name/email error:", err?.response?.data || err.message);
            throw err;
        }
    };

    // 📦 Get rest of the profile
    const fetchUserProfile = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser((prev) => ({
                ...prev,
                ...res.data.user,
            }));
        } catch (err) {
            console.error("Fetch profile error:", err?.response?.data || err.message);
            throw err;
        }
    };

    // ✏️ Update profile (except name/email/password)
    const updateProfile = async (updates) => {
        try {
            const res = await axios.put(`${BASE_URL}/api/user/update-profile`, updates, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser((prev) => ({
                ...prev,
                ...res.data.user,
            }));
        } catch (err) {
            console.error("Update profile error:", err?.response?.data || err.message);
            throw err;
        }
    };


    // 🚪 Logout
    const logout = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("token");
    };

    // Auto-fetch on token change
    useEffect(() => {
        if (token) {
            fetchUserProfile();
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
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
