import { createContext } from "react";

export const InstituteContext = createContext();

const InstituteContextProvider = (props) => {
    console.log("context")
    return (
        <InstituteContext.Provider value={{}}>
            {props.children}
        </InstituteContext.Provider>
    );
}

export default InstituteContextProvider;