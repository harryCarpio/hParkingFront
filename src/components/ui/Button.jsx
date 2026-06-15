const Button = ({ texto, type = "button", onClick, disabled, cargando, variante = "primary", tamanio = "lg", icono }) => {

  const variantes = {
      primary: "bg-slate-700 hover:bg-slate-800 text-white",
      secondary: "bg-white hover:bg-gray-300 text-gray-700 border border-gray-400",
      danger: "bg-red-600 hover:bg-red-700 text-white",
  }

  const tamanios = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "w-full py-2 text-base",
  }

  return (
      <button
          type={type}
          onClick={onClick}
          disabled={disabled || cargando}
          className={`flex items-center justify-center gap-2 font-semibold rounded-lg
              transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed
              ${variantes[variante]} ${tamanios[tamanio]}`}
      >
          {cargando ? "Cargando..." : (
              <>
                  {icono && icono}
                  {texto}
              </>
          )}
      </button>
  )
}

export default Button