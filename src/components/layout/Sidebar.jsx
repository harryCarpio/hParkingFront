import React, { useState } from 'react'
import menuItems from '../../services/menuItems';
import { useLocation, useNavigate } from 'react-router-dom'
import SideBarMenuItem from '../ui/SideBarMenuItem';
import { temas } from '../../styles/temas';
import { ChevronDown, X } from 'lucide-react';

//dado un item de menu (que puede tener path directo o children anidados)
//devuelve la primera ruta navegable dentro de el
const encontrarPrimeraRuta = (item) => {
    if (item.path) return item.path
    if (item.children?.length) return encontrarPrimeraRuta(item.children[0])
    return null
}

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [openId, setOpenId] = useState(null);
    const [openSubId, setOpenSubId] = useState(null);

    //funcion para efecto acordeon de los menus, si esta abierto se cierra y sino se abre
    //y direccion de los iconos
    const handleParentClick = (item) => {
        if (!item.children || item.children.length === 0) {
            navigate(item.path)
            setOpenId(null)
            setOpenSubId(null)
            return
        }
        const estaAbierto = openId === item.id
        if (estaAbierto) {
            setOpenId(null)
            setOpenSubId(null)
        } else {
            setOpenId(item.id)
            setOpenSubId(null)
            navigate(encontrarPrimeraRuta(item))
        }
    }

    //los hijos del menu pueden ser una pagina (path) o un submenu anidado (children)
    const handleChildClick = (child) => {
        if (child.children && child.children.length > 0) {
            const estaAbierto = openSubId === child.id
            if (estaAbierto) {
                setOpenSubId(null)
            } else {
                setOpenSubId(child.id)
                navigate(encontrarPrimeraRuta(child))
            }
            return
        }
        navigate(child.path)
        setOpenSubId(null)
    }
    return (
        <aside className={`w-64 min-h-screen ${temas.sidebar.bg} flex flex-col py-4 px-3 shadow-xl
        fixed  inset-y-0 left-0 z-30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:translate-x-0 lg:z-auto
        lg:transition-none
         ${!isOpen ? 'lg:hidden' : 'lg:flex'}
        `}>
            <div className="flex justify-end mb-3 lg:hidden">
                <button onClick={onClose} className="text-white hover:text-blue-200 transition-colors">
                    <X size={20} />
                </button>
            </div>
            {menuItems.map((item) => {
                const abierto = openId === item.id
                const hasChildren = item.children && item.children.length > 0

                return (
                    <div key={item.id} className="mb-1 sidebar-item-divider">
                        {/*Menu padre */}
                        <SideBarMenuItem
                            icon={item.icon}
                            label={item.label}
                            isOpen={abierto}
                            hasChildren={hasChildren}
                            onClick={() => handleParentClick(item)} />

                        {/*Submenu */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out
                            ${abierto ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className={`mt-1 ml-4 flex flex-col gap-1 border-xl ${temas.sidebar.border} pl-3`}>
                                {item.children.map((child) => {
                                    const childHasChildren = child.children && child.children.length > 0

                                    if (childHasChildren) {
                                        const subAbierto = openSubId === child.id
                                        return (
                                            <div key={child.id}>
                                                <button
                                                    onClick={() => handleChildClick(child)}
                                                    className={`w-full flex items-center gap-2 text-left text-sm font-semibold px-3 py-2 rounded-md
                                                    transition-colors duration-150
                                                    ${subAbierto
                                                            ? `${temas.sidebar.childActive} text-white`
                                                            : `${temas.sidebar.childText} ${temas.sidebar.childHover} hover:text-white`
                                                        }`}>
                                                    <span className="flex-1">{child.label}</span>
                                                    <ChevronDown
                                                        size={14}
                                                        className={`flex-shrink-0 transition-transform duration-300 ${subAbierto ? 'rotate-180' : 'rotate-0'}`}
                                                    />
                                                </button>
                                                <div className={`overflow-hidden transition-all duration-300 ease-in-out
                                                    ${subAbierto ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <div className={`mt-1 ml-3 flex flex-col gap-1 border-xl ${temas.sidebar.border} pl-3`}>
                                                        {child.children.map((grandchild) => {
                                                            const isActive = location.pathname === grandchild.path
                                                            return (
                                                                <button key={grandchild.path}
                                                                    onClick={() => handleChildClick(grandchild)}
                                                                    className={`text-left text-sm font-semibold px-3 py-2 rounded-md
                                                                transition-colors duration-150
                                                                 ${isActive
                                                                            ? `${temas.sidebar.childActive} text-white text-sm`
                                                                            : `${temas.sidebar.childText} ${temas.sidebar.childHover} hover:text-white`
                                                                        }`}>

                                                                    {grandchild.label}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                    const isActive = location.pathname === child.path
                                    return (
                                        <button key={child.path}
                                            onClick={() => handleChildClick(child)}
                                            className={`text-left text-sm  font-semibold px-3 py-2 rounded-md
                                        transition-colors duration-150
                                         ${isActive
                                                    ? `${temas.sidebar.childActive} text-white  text-sm`
                                                    : `${temas.sidebar.childText} ${temas.sidebar.childHover} hover:text-white`
                                                }`}>

                                            {child.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                )
            })}
        </aside>
    )
}

export default Sidebar