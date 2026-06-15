import React, { useEffect, useRef, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { LogOut, Menu, Settings, User } from 'lucide-react';
import { temas } from '../../styles/temas';

const Navbar = ({ onMenuClick }) => {
    const { logout, usuario } = useAuth();
    const [menuAbierto, setMenuAbiert] = useState(false);
    const avatarRef = useRef(null);

    //para efecto de iniciales en avatar
    const getIniciales = (name) => {
        if (!name) return "?";
        return name.split(" ").slice(0, 2).map((n) => n[0].toUpperCase()).join("");
    };

    //permite cerrar el menu desplegable al hacer click;
    useEffect(() => {
        const handler = (e) => {
            if (avatarRef.current && !avatarRef.current.contains(e.target)) {
                setMenuAbiert(false);
            }
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [])

    return (
        <nav className={`sticky top-0 z-30 w-full ${temas.navbar.bg} text-white px-6 py-3 flex items-center justify-between shadow-md`}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center" }}>

            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className=" text-white hover:text-blue-200 transition-colors"
                >
                    <Menu size={22} />
                </button>
                <span className="text-xl font-bold tracking-wide">hParking</span>

            </div>
            
            <div className="flex justify-end" ref={avatarRef}>
                <div className="relative">
                    <button
                        onClick={() => setMenuAbiert(!menuAbierto)}
                        title={usuario?.name || "Usuario"} 
                        className="w-9 h-9 rounded-full bg-celestevr border border-white/25 
                            flex items-center justify-center text-sm font-semibold
                             transition duration-200"
                    >
                        {getIniciales(usuario?.name)}
                    </button>


                    {menuAbierto && (
                        <div className="absolute right-0 top-full mt-2 w-52 bg-white text-gray-800 
                            rounded-xl border border-gray-100 shadow-lg z-50 overflow-hidden">


                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-medium">{usuario?.name || "Usuario"}</p>
                                {/*<p className="text-xs text-gray-400">{usuario?.role || "Administrador"}</p>*/}
                            </div>

                            {/*Menu de opcioens en caso de requerirse para editar el perfil*/}
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 
                                text-sm text-gray-600 hover:bg-red-50 transition-colors">
                                <User size={15} /> Mi perfil
                            </button>

                            <div className="border-t border-gray-100 mt-1" />


                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 
                                    text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={15} /> Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </nav>
    )
}

export default Navbar