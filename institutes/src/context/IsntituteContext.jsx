import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios"; // Use Axios for HTTP requests
import { useNavigate } from "react-router-dom";

export const InstituteContext = createContext();

const InstituteContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Get backend URL from environment variables
  const [user, setUser] = useState(null); // State to store the logged-in user
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null); // Persist auth token
  const navigate = useNavigate();

  // Load user data from local storage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);

  // Function to register an institute
  const registerInstitute = async (name, email, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/institute/register`, { name, email, password });

      // Update the state with the user and token
      setUser(response.data.user);
      setAuthToken(response.data.token);

      // Store the token in localStorage (optional for persistence)
      localStorage.setItem("authToken", response.data.token);

      return response.data; // Return the response for further handling
    } catch (error) {
      console.error("Error registering institute:", error.response?.data || error.message);
      throw error.response?.data || { error: "Registration failed" }; // Throw the error to handle it in components
    }
  };

  const loginInstituteUser = async (email, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/institute/login`, { email, password });

      // Update state with user info and token
      setUser(response.data.user);
      setAuthToken(response.data.token);

      // Store token in localStorage for persistence
      localStorage.setItem("authToken", response.data.token);

      return response.data; // Return the response for further handling
    } catch (error) {
      console.error("Error logging in:", error.response?.data || error.message);
      throw error.response?.data || { error: "Login failed" }; // Throw error for component handling
    }
  };

  const completeProfile = async (streetAddress, zipcode, phonenumber, type, city, state) => {
    try {
      const authToken = localStorage.getItem("authToken"); // Ensure token is fetched properly
      console.log(authToken)

      if (!authToken) {
        throw new Error("Authorization token is missing");
      }

      const response = await axios.post(
        `${backendUrl}/api/institute/completeProfile`,
        { streetAddress, zipcode, phonenumber, type, city, state },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Send token in header
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Profile updated:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error completing profile:", error.response?.data || error.message);
      throw error.response?.data || { error: "Profile update failed" };
    }
  };


  const showdataEmailName = useCallback(async () => {
    try {
      if (!authToken) {
        console.error("Auth token is missing");
        throw { error: "Authorization token is missing" };
      }

      console.log("Fetching user data...", authToken);

      const response = await axios.get(`${backendUrl}/api/institute/email-name`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      console.log(" User data response:", response.data);

      if (!response.data.user) {  // 🔥 FIX: Use `user` instead of `users`
        console.error("No user found in response:", response.data);
        return null;
      }

      setUser(response.data.user); // 🔥 FIX: Assign `user` instead of `users[0]`
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
      throw error.response?.data || { error: "Failed to fetch user data" };
    }
  }, [authToken]);
  // Fetch User Data (Excluding Email & Name)
  const showDataExceptEmailName = useCallback(async () => {
    try {
      if (!authToken) {
        console.error("Auth token is missing");
        throw { error: "Authorization token is missing" };
      }

      console.log("Fetching user data (excluding email & name)...", authToken);

      const response = await axios.get(`${backendUrl}/api/institute/data-except-email-name`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      console.log("User data (excluding email & name) response:", response.data);

      if (!response.data.user) {
        console.error("No user found in response:", response.data);
        return null;
      }

      return response.data.user; // Returning user without updating state (as it excludes email/name)
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
      throw error.response?.data || { error: "Failed to fetch user data" };
    }
  }, [authToken]);


  const updateProfileExceptEmailName = useCallback(async (updatedData) => {
    try {
      if (!authToken) {
        console.error("Auth token is missing");
        throw { error: "Authorization token is missing" };
      }

      console.log("Updating user profile (excluding email and name)...", updatedData);

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

      console.log("Profile updated successfully:", response.data);

      // Optional: Update local state with new user data
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedData, // Merge updated fields while keeping name & email unchanged
      }));

      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error.response?.data || error.message);
      throw error.response?.data || { error: "Failed to update user profile" };
    }
  }, [authToken]);


  const value = {
    user,
    authToken,
    registerInstitute,
    loginInstituteUser,
    completeProfile,
    navigate,
    showdataEmailName,
    showDataExceptEmailName,
    updateProfileExceptEmailName,
  };

  return <InstituteContext.Provider value={value}>{props.children}</InstituteContext.Provider>;
};

export default InstituteContextProvider;
