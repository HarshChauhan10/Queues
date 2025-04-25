import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const InstituteContext = createContext();

const InstituteContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);
  const navigate = useNavigate();

  // Persist authToken from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);

  // Register a new institute
  const registerInstitute = async (name, email, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/institute/register`, {
        name,
        email,
        password,
      });

      setUser(response.data.user);
      setAuthToken(response.data.token);
      localStorage.setItem("authToken", response.data.token);

      return response.data;
    } catch (error) {
      console.error("Error registering institute:", error.response?.data || error.message);
      throw error.response?.data || { error: "Registration failed" };
    }
  };

  // Login institute
  const loginInstituteUser = async (email, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/institute/login`, {
        email,
        password,
      });

      setUser(response.data.user);
      setAuthToken(response.data.token);
      localStorage.setItem("authToken", response.data.token);

      return response.data;
    } catch (error) {
      console.error("Error logging in:", error.response?.data || error.message);
      throw error.response?.data || { error: "Login failed" };
    }
  };

  // Complete institute profile
  const completeProfile = async (streetAddress, zipcode, phonenumber, type, city, state) => {
    try {
      if (!authToken) throw new Error("Authorization token is missing");

      const response = await axios.post(
        `${backendUrl}/api/institute/completeProfile`,
        { streetAddress, zipcode, phonenumber, type, city, state },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error completing profile:", error.response?.data || error.message);
      throw error.response?.data || { error: "Profile update failed" };
    }
  };

  // Fetch email and name
  const showdataEmailName = useCallback(async () => {
    try {
      if (!authToken) throw { error: "Authorization token is missing" };

      const response = await axios.get(`${backendUrl}/api/institute/email-name`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.data.user) return null;

      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
      throw error.response?.data || { error: "Failed to fetch user data" };
    }
  }, [authToken]);

  // Fetch data excluding email & name
  const showDataExceptEmailName = useCallback(async () => {
    try {
      if (!authToken) throw { error: "Authorization token is missing" };

      const response = await axios.get(`${backendUrl}/api/institute/data-except-email-name`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.data.user) return null;

      return response.data.user;
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
      throw error.response?.data || { error: "Failed to fetch user data" };
    }
  }, [authToken]);

  // Update data excluding email & name
  const updateProfileExceptEmailName = useCallback(async (updatedData) => {
    try {
      if (!authToken) throw { error: "Authorization token is missing" };

      const response = await axios.put(
        `${backendUrl}/api/institute/update-profile`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUser((prevUser) => ({
        ...prevUser,
        ...updatedData,
      }));

      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error.response?.data || error.message);
      throw error.response?.data || { error: "Failed to update user profile" };
    }
  }, [authToken]);

  // Get all institutes with queue counts
  const fetchInstitutesWithQueueCount = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/queue/institutes`);
      return res.data;
    } catch (err) {
      console.error("Fetch institutes queue error:", err.response?.data || err.message);
      throw err;
    }
  };

  // Get stats for current institute
  const fetchQueueStats = async (instituteId) => {
    try {
      const res = await axios.get(`${backendUrl}/api/queue/stats/${instituteId}`);
      return res.data;
    } catch (err) {
      console.error("Fetch queue stats error:", err.response?.data || err.message);
      throw err;
    }
  };

  // Remove user from queue (admin)
  const removeUserFromQueue = async (instituteId, userId) => {
    try {
      const res = await axios.delete(
        `${backendUrl}/api/queue/remove/${instituteId}/${userId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      return res.data;
    } catch (err) {
      console.error("Remove user from queue error:", err.response?.data || err.message);
      throw err;
    }
  };

  const value = {
    user,
    authToken,
    navigate,
    registerInstitute,
    loginInstituteUser,
    completeProfile,
    showdataEmailName,
    showDataExceptEmailName,
    updateProfileExceptEmailName,
    fetchInstitutesWithQueueCount,
    fetchQueueStats,
    removeUserFromQueue,
  };

  return <InstituteContext.Provider value={value}>{children}</InstituteContext.Provider>;
};

export default InstituteContextProvider;
