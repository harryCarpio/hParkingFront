

import{ useContext } from 'react'
import { AuthContext } from '../context/AuthContext';

//nos permite consumir el contexto de autenticacion, para evitar importar directamente el 
//contexto, solo importamos este hook;

const useAuth = () => {
    const contexto = useContext(AuthContext);
    if (!contexto) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider")
    }
    return contexto;
}

export default useAuth