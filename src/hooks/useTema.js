import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext';

//nos permite consumir el contexto de tema, para evitar importar directamente el
//contexto, solo importamos este hook;

const useTema = () => {
    const contexto = useContext(ThemeContext);
    if (!contexto) {
        throw new Error("useTema debe usarse dentro de un ThemeProvider")
    }
    return contexto;
}

export default useTema
