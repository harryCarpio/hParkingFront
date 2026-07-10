export const temas = {
    sidebar: {
        bg: 'bg-chrome-bg',
        text: 'text-chrome-text',
        hover: 'hover:bg-chrome-hover',
        active: 'bg-chrome-hover',
        border: 'border-chrome-border',
        childActive: 'bg-chrome-active',
        childHover: 'hover:bg-chrome-hover',
        childHoverText: 'hover:text-chrome-text',
        childText: 'text-chrome-muted',
    },
    navbar: {
        bg: 'bg-chrome-bg',
        text: 'text-chrome-text',
        button: 'bg-chrome-hover hover:bg-chrome-active',
        userText: 'text-chrome-muted',
        border: 'border-chrome-border',
    },
    breadcrumb: {
        text: 'text-neutral-500',
        link: 'text-neutral-500 hover:text-brand',
        active: 'text-brand font-semibold',
        separator: 'text-neutral-300',
    },
    paginador: {
        button: `w-8 h-8 flex items-center justify-center rounded-lg
        border border-gray-200 text-gray-600
        hover:bg-gray-300
        disabled:opacity-40 disabled:cursor-not-allowed
        transition-colors`,
        active: `bg-brand text-white font-semibold border-brand-dark`,
        numberButton: `w-8 h-8 flex items-center justify-center
        rounded-lg text-xs transition-colors`,
        select: ` border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white
        cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2
        focus:ring-brand/20`

    },
    tabla: {
        encabezado: 'bg-brand text-white',
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
        textoNegritaAzul: `font-bold text-emphasis`
    }, 

    inputColumnas:{
        
        dos: "grid grid-cols-2 gap-4 items-end",
        tres: "grid grid-cols-3 gap-4 items-end",
        cuatro: "grid grid-cols-4 gap-4 items-end",
    }


    



}