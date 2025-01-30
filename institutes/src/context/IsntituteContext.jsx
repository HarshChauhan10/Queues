import { createContext, useState } from "react";
import axios from "axios"; // Use Axios for HTTP requests
import { useNavigate } from "react-router-dom";

export const InstituteContext = createContext();

const InstituteContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Get backend URL from environment variables
  const [user, setUser] = useState(null); // State to store the logged-in user
  const [authToken, setAuthToken] = useState(null); // State to store the JWT token
  const navigate = useNavigate();

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




  const value  = {
    user,
    authToken,
    registerInstitute, 
    loginInstituteUser,
    navigate,
  };

  return (
    <InstituteContext.Provider
      value={{
        value// Expose the function
      }}
    >
      {props.children}
    </InstituteContext.Provider>
  );
};

export default InstituteContextProvider;
