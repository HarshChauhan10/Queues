import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

const UserProvider = ({ children }) => {

    const BASE_URL = import.meta.env.VITE_BACKEND_URL;


    return (
        <UserContext.Provider value={{}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
