import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import menuItems from '../../services/menuItems';
import { useLocation, useNavigate } from 'react-router-dom'
import SideBarMenuItem from '../ui/SideBarMenuItem';
import { temas } from '../../styles/temas';
import { X } from 'lucide-react';
import useTema from '../../hooks/useTema';

const temasDisponibles = [
    { id: 'slate', label: 'Slate', swatch: 'bg-slate-700' },
    { id: 'emerald', label: 'Emerald green', swatch: 'bg-emerald-600' },
]

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const sidebarRef = useRef(null)
    const dropdownRef = useRef(null)
    const { tema, setTema } = useTema()

    const [openId, setOpenId] = useState(null);
    //posicion en pantalla del dropdown flotante (modo colapsado), calculada desde el icono clickeado
    const [flyoutPos, setFlyoutPos] = useState(null)

    //en modo colapsado el submenu se muestra como dropdown flotante (via portal), se cierra al hacer click afuera o al redimensionar
    useEffect(() => {
        if (isOpen) return
        const handleClickOutside = (e) => {
            if (sidebarRef.current?.contains(e.target)) return
            if (dropdownRef.current?.contains(e.target)) return
            setOpenId(null)
        }
        const handleResize = () => setOpenId(null)
        document.addEventListener('mousedown', handleClickOutside)
        window.addEventListener('resize', handleResize)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            window.removeEventListener('resize', handleResize)
        }
    }, [isOpen])

    //funcion para efecto acordeon de los menus, si esta abierto se cierra y sino se abre
    //y direccion de los iconos
    const handleParentClick = (item, event) => {
        if (!item.children || item.children.length === 0) {
            navigate(item.path)
            setOpenId(null)
            return
        }
        const estaAbierto = openId === item.id
        if (estaAbierto) {
            setOpenId(null)
            return
        }
        if (isOpen) {
            setOpenId(item.id)
            //en modo expandido el acordeon inline ademas navega a la primera opcion
            navigate(item.children[0].path)
            return
        }
        //modo colapsado: se despliega el dropdown flotante junto al icono para que el usuario elija
        const rect = event.currentTarget.getBoundingClientRect()
        setFlyoutPos({ top: rect.top, left: rect.right + 8 })
        setOpenId(item.id)
    }

    const handleChildClick = (path) => {
        navigate(path)
    }

    const handleDropdownChildClick = (path) => {
        navigate(path)
        setOpenId(null)
    }

    const flyoutItem = !isOpen ? menuItems.find((item) => item.id === openId) : null

    return (
        <aside ref={sidebarRef} className={`${isOpen ? 'w-64' : 'w-64 lg:w-20'} h-full ${temas.sidebar.bg} flex flex-col py-4 px-3 shadow-xl
        fixed  inset-y-0 left-0 z-30
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:translate-x-0 lg:z-auto lg:flex
        `}>
            <div className="flex justify-end mb-3 lg:hidden">
                <button onClick={onClose} className={`${temas.sidebar.text} hover:opacity-70 transition-opacity`}>
                    <X size={20} />
                </button>
            </div>
            {menuItems.map((item) => {
                const abierto = openId === item.id
                const hasChildren = item.children && item.children.length > 0

                return (
                    <div key={item.id} className="mb-1">
                        {/*Menu padre */}
                        <SideBarMenuItem
                            icon={item.icon}
                            label={item.label}
                            isOpen={abierto}
                            hasChildren={hasChildren}
                            expanded={isOpen}
                            onClick={(e) => handleParentClick(item, e)} />

                        {/*Submenu inline, modo expandido */}
                        {isOpen && (
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out
                                ${abierto ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className={`mt-1 ml-4 flex flex-col gap-1 border-xl ${temas.sidebar.border} pl-3`}>
                                    {item.children.map((child) => {
                                        const isActive = location.pathname === child.path
                                        return (
                                            <button key={child.path}
                                                onClick={() => handleChildClick(child.path)}
                                                className={`text-left text-sm  font-semibold px-3 py-2 rounded-md
                                            transition-colors duration-150
                                             ${isActive
                                                        ? `${temas.sidebar.childActive} text-white  text-sm`
                                                        : `${temas.sidebar.childText} ${temas.sidebar.childHover} ${temas.sidebar.childHoverText}`
                                                    }`}>

                                                {child.label}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                )
            })}

            {/*Selector de tema, siempre al fondo del sidebar */}
            <div className={`mt-auto pt-3 border-t ${temas.sidebar.border} flex gap-2 ${isOpen ? 'px-1' : 'flex-col items-center'}`}>
                {temasDisponibles.map((t) => {
                    const seleccionado = tema === t.id
                    return (
                        <button
                            key={t.id}
                            onClick={() => setTema(t.id)}
                            title={t.label}
                            className={`flex items-center gap-2 rounded-lg transition-all duration-200
                            ${isOpen ? 'flex-1 px-3 py-2' : 'p-2'}
                            ${seleccionado ? 'bg-chrome-hover' : 'hover:bg-chrome-hover'}`}>
                            <span className={`w-4 h-4 rounded-full flex-shrink-0 ${t.swatch} ${seleccionado ? 'ring-2 ring-chrome-text' : 'ring-1 ring-chrome-border'}`} />
                            {isOpen && <span className={`text-xs font-medium ${temas.sidebar.text} truncate`}>{t.label}</span>}
                        </button>
                    )
                })}
            </div>

            {/*Submenu como dropdown flotante, modo colapsado (solo iconos).
            Se renderiza en un portal sobre document.body para que quede siempre por encima
            de cualquier otro elemento de la pagina, sin importar el stacking context del contenido. */}
            {flyoutItem && flyoutPos && createPortal(
                <div
                    ref={dropdownRef}
                    style={{ position: 'fixed', top: flyoutPos.top, left: flyoutPos.left }}
                    className={`z-[9999] w-56 ${temas.sidebar.bg} rounded-lg shadow-xl border ${temas.sidebar.border} py-2 px-2`}>
                    <p className={`px-2 pb-2 mb-1 text-xs font-semibold uppercase tracking-wide ${temas.sidebar.childText} border-b ${temas.sidebar.border}`}>
                        {flyoutItem.label}
                    </p>
                    <div className="flex flex-col gap-1">
                        {flyoutItem.children.map((child) => {
                            const isActive = location.pathname === child.path
                            return (
                                <button key={child.path}
                                    onClick={() => handleDropdownChildClick(child.path)}
                                    className={`text-left text-sm font-semibold px-3 py-2 rounded-md
                                    transition-colors duration-150
                                     ${isActive
                                            ? `${temas.sidebar.childActive} text-white`
                                            : `${temas.sidebar.childText} ${temas.sidebar.childHover} ${temas.sidebar.childHoverText}`
                                        }`}>
                                    {child.label}
                                </button>
                            )
                        })}
                    </div>
                </div>,
                document.body
            )}
        </aside>
    )
}

export default Sidebar
