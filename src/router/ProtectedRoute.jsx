import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Spinner from "../components/ui/Spinner";


//este componente nos ayuda a proteger todas las rutas definidas en 
//app.js, si no esta autenticado redirige al login
const ProtectedRoute = ({children}) => {
    const {usuario, cargando} = useAuth();

    if(cargando){
        return <Spinner text="Verificando sesión..."/>
    }

    if(!usuario){
        return<Navigate to="/" replace/>
    }
    //si existe autenticacion, se muestra el contenido de la ruta protegida
    return children;
  
};

export default ProtectedRoute;
