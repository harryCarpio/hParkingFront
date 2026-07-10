import { ChevronDown } from 'lucide-react'
import React from 'react'
import { temas } from '../../styles/temas'

//este atomo es reutilizable para el sidebar, es el menu de cada opcion el "padre"
//el icono,texto,saber si esta extendido,cuando se muestr la flechita de expandido,la funcion al darle click


const SideBarMenuItem = ({ icon, label, isOpen, hasChildren = false, expanded = true, onClick }) => {
    return (
        <button
            onClick={onClick}
            title={!expanded ? label : undefined}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold
        text-white rounded-lg transition-all duration-200
         ${temas.sidebar.hover} active:scale-[0.98]
        ${isOpen ? temas.sidebar.active : 'bg-transparent'}
        ${!expanded ? 'lg:justify-center' : ''}`
            }
        >

            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {icon}
            </span>
            <span className={`flex-1 text-left leading-tight ${!expanded ? 'lg:hidden' : ''}`}>{label}</span>


            {hasChildren && (
                <ChevronDown
                    size={16}
                    className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'} ${!expanded ? 'lg:hidden' : ''}`}
                />
            )}
        </button>
    )
}

export default SideBarMenuItem
