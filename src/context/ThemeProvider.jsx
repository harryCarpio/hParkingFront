import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const TEMA_STORAGE_KEY = "hparking-tema";
const TEMA_POR_DEFECTO = "slate";

export const ThemeProvider = ({ children }) => {
    const [tema, setTema] = useState(() => (
        localStorage.getItem(TEMA_STORAGE_KEY) || TEMA_POR_DEFECTO
    ));

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", tema);
        localStorage.setItem(TEMA_STORAGE_KEY, tema);
    }, [tema]);

    return (
        <ThemeContext.Provider value={{ tema, setTema }}>
            {children}
        </ThemeContext.Provider>
    );
};
