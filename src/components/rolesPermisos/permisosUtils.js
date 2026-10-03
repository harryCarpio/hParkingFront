//misma regla de comodines que el backend (PermissionMatcher): un segmento "*" cubre el resto de segmentos
export const coincidePermiso = (otorgado, requerido) => {
    if (otorgado === '*') return true
    const partesOtorgado = otorgado.split(':')
    const partesRequerido = requerido.split(':')
    for (let i = 0; i < partesOtorgado.length; i++) {
        if (partesOtorgado[i] === '*') return true
        if (i >= partesRequerido.length) return false
        if (partesOtorgado[i] !== partesRequerido[i]) return false
    }
    return partesOtorgado.length === partesRequerido.length
}

export const esComodin = (permiso) => permiso.endsWith('*')

//comodin (distinto del propio permiso) que cubre un permiso del catalogo, si lo hay
export const comodinQueCubre = (permiso, otorgados) =>
    otorgados.find((otorgado) => esComodin(otorgado) && coincidePermiso(otorgado, permiso))

//agrupa el catalogo por dominio (primer segmento), ordenado alfabeticamente
export const agruparPorDominio = (catalogo) => {
    const grupos = new Map()
    catalogo.forEach((item) => {
        if (!grupos.has(item.domain)) grupos.set(item.domain, [])
        grupos.get(item.domain).push(item)
    })
    return [...grupos.entries()].sort(([a], [b]) => a.localeCompare(b))
}
