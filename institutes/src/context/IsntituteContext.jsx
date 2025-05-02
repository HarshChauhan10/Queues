import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const InstituteContext = createContext();

const InstituteContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);
  const [loading, setLoading] = useState(true); // Prevent premature redirects

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // ms
      return expirationTime < Date.now();
    } catch (error) {
      console.error("Error parsing token:", error);
      return true;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken && !isTokenExpired(storedToken)) {
      setAuthToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

      axios.get(`${backendUrl}/api/institute/name-email`)
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((error) => {
          console.error("Token error:", error);
          setAuthToken(null);
          localStorage.removeItem("authToken");
          navigate("/");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Token is missing or expired
      setAuthToken(null);
      localStorage.removeItem("authToken");
      navigate("/");
      setLoading(false);
    }
  }, [backendUrl, navigate]);

  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [authToken]);

  const registerInstitute = async (name, email, password) => {
    try {
      const res = await axios.post(`${backendUrl}/api/institute/register`, {
        name,
        email,
        password,
      });

      const { token, user } = res.data;

      setUser(user);
      setAuthToken(token);
      localStorage.setItem("authToken", token);
      navigate('/complete-profile');

      return res.data;
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      throw error.response?.data || { error: "Registration failed" };
    }
  };

  const loginInstituteUser = async (email, password) => {
    try {
      const res = await axios.post(`${backendUrl}/api/institute/login`, {
        email,
        password,
      });

      const { token, user } = res.data;

      setUser(user);
      setAuthToken(token);
      localStorage.setItem("authToken", token);
      navigate('/complete-profile');

      return res.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error.response?.data || { error: "Login failed" };
    }
  };

  const completeProfile = async (profileData) => {
    try {
      const res = await axios.post(`${backendUrl}/api/institute/complete-profile`, profileData);
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      console.error("Profile completion error:", error.response?.data || error.message);
      throw error.response?.data || { error: "An error occurred while completing the profile" };
    }
  };

  const getEmailAndName = async () => {
    if (!authToken) {
      navigate("/");
      return;
    }
    try {
      const res = await axios.get(`${backendUrl}/api/institute/name-email`);
      return res.data.user;
    } catch (error) {
      console.error("Fetch email/name error:", error.response?.data || error.message);
      throw error.response?.data || { error: "Error fetching user data" };
    }
  };

  const getProfileDataWithoutEmailAndName = async () => {
    if (!authToken) {
      navigate("/");
      return;
    }
    try {
      const res = await axios.get(`${backendUrl}/api/institute/profile-details`);
      return res.data.user;
    } catch (error) {
      console.error("Fetch profile error:", error.response?.data || error.message);
      throw error.response?.data || { error: "Error fetching profile data" };
    }
  };

  const updateProfileWithoutEmailAndName = async (updatedFields) => {
    try {
      const res = await axios.put(`${backendUrl}/api/institute/update-profile`, updatedFields);
      return res.data.user;
    } catch (error) {
      console.error("Update profile error:", error.response?.data || error.message);
      throw error.response?.data || { error: "Error updating profile" };
    }
  };

  const updateApproxTimePerPerson = async (approxTimePerPerson) => {
    try {
      const res = await axios.put(`${backendUrl}/api/institute/update-approx-time`, {
        approxTimePerPerson,
      });
      return res.data.user;
    } catch (error) {
      console.error("Update approxTimePerPerson error:", error.response?.data || error.message);
      throw error.response?.data || { error: "Error updating approxTimePerPerson" };
    }
  };

  // Show nothing (or a spinner) while checking token
  if (loading) return null;

  return (
    <InstituteContext.Provider
      value={{
        user,
        authToken,
        registerInstitute,
        loginInstituteUser,
        completeProfile,
        getEmailAndName,
        getProfileDataWithoutEmailAndName,
        updateProfileWithoutEmailAndName,
        updateApproxTimePerPerson,
      }}
    >
      {children}
    </InstituteContext.Provider>
  );
};

export default InstituteContextProvider;
