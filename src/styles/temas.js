export const temas = {
    sidebar: {
        bg: 'bg-slate-700',
        hover: 'hover:bg-slate-800',
        active: 'bg-slate-800',
        border: 'border-slate-600',
        childActive: 'bg-slate-600',
        childHover: 'hover:bg-slate-800',
        childText: 'text-slate-100',
    },
    navbar: {
        bg: 'bg-slate-700',
        button: 'bg-slate-600 hover:bg-slate-800',
        userText: 'text-slate-300',
    },
    paginador: {
        button: `w-8 h-8 flex items-center justify-center rounded-lg
        border border-gray-200 text-gray-600
        hover:bg-gray-300
        disabled:opacity-40 disabled:cursor-not-allowed
        transition-colors`,
        active: `bg-slate-700 text-white font-semibold border-blue-800`,
        numberButton: `w-8 h-8 flex items-center justify-center
        rounded-lg text-xs transition-colors`,
        select: ` border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white 
        cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 
        focus:ring-blue-900/20`

    },
    tabla: {
        acciones: {
            base: ` p-2 rounded-lg cursor-pointer transition-all duration-200 
            hover:scale-105 active:scale-95`,
            ver: ` bg-blue-50 text-slate-700 hover:bg-blue-100`,
            editar: ` bg-green-50 text-slate-700 hover:bg-green-100`,
            eliminar: ` bg-red-50 text-slate-700   hover:bg-red-100`
        }
    },

    texto:{
        textoNegrita: `font-bold text-slate-700`,
        textoErrorFormulario: "text-red-500 text-sm text-center bg-red-50 py-2 px-3 rounded-lg",
        textoNegritaAzul: `font-bold text-blue-900`
    }, 

    inputColumnas:{
        
        dos: "grid grid-cols-2 gap-4 items-end",
        tres: "grid grid-cols-3 gap-4 items-end",
        cuatro: "grid grid-cols-4 gap-4 items-end",
    }


    



}