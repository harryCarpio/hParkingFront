import { matchPath } from 'react-router-dom'

//cada entrada define la ruta (puede tener parametros dinamicos) y las migas de pan
//que se deben mostrar para esa pantalla. Las migas sin "path" no son clickeables.
const breadcrumbRoutes = [
    { path: '/panelAdministracion', crumbs: [{ label: 'Inicio' }] },
    { path: '/estacionamiento/usos', crumbs: [{ label: 'Estacionamiento' }, { label: 'Usos' }] },
    { path: '/estacionamiento/facturas', crumbs: [{ label: 'Estacionamiento' }, { label: 'Facturas' }] },
    { path: '/estacionamientos/listado', crumbs: [{ label: 'Configuraciones' }, { label: 'Estacionamientos' }] },
    {
        path: '/estacionamientos/crear',
        crumbs: [
            { label: 'Configuraciones' },
            { label: 'Estacionamientos', path: '/estacionamientos/listado' },
            { label: 'Crear estacionamiento' },
        ],
    },
    {
        path: '/estacionamientos/:id/sistemas',
        crumbs: [
            { label: 'Configuraciones' },
            { label: 'Estacionamientos', path: '/estacionamientos/listado' },
            { label: 'Sistemas' },
        ],
    },
    {
        path: '/estacionamientos/sistemas/:id/operaciones',
        crumbs: [
            { label: 'Configuraciones' },
            { label: 'Estacionamientos', path: '/estacionamientos/listado' },
            { label: 'Sistemas' },
            { label: 'Operaciones' },
        ],
    },
    {
        path: '/usuarios-sistema/listado',
        crumbs: [{ label: 'Configuraciones' }, { label: 'Usuarios de sistema' }],
    },
    {
        path: '/usuariosapp/listado',
        crumbs: [{ label: 'Configuraciones' }, { label: 'Usuarios de aplicaciones' }],
    },
    { path: '/pruebas/consola', crumbs: [{ label: 'Pruebas API' }, { label: 'Consola de pruebas' }] },
]

//busca la definicion de migas que corresponde a la ruta actual, soportando parametros dinamicos (:id)
export const getBreadcrumbs = (pathname) => {
    const encontrada = breadcrumbRoutes.find((ruta) => matchPath({ path: ruta.path, end: true }, pathname))
    return encontrada?.crumbs ?? []
}
