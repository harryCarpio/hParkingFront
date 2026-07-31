//formatea una fecha ISO a fecha/hora local legible
export const formatearFecha = (iso) => (
    iso ? new Date(iso).toLocaleString() : '—'
)

//formatea un monto numerico como moneda (USD)
export const formatearMoneda = (valor) => (
    valor === null || valor === undefined ? '—' : `$${Number(valor).toFixed(2)}`
)
