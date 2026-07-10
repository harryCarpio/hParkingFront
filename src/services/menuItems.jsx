import { FlaskConical, Home, ParkingSquare, Settings } from 'lucide-react'
import React from 'react'

const menuItems = [
    {
        id: 'inicio',
        label: 'Inicio',
        icon: <Home size={22} />,
        path: '/panelAdministracion',
        children: [],
    },
    {
        id: 'estacionamiento',
        label: 'Estacionamiento',
        icon: <ParkingSquare size={22} />,
        children: [
            { label: 'Usos', path: '/estacionamiento/usos' },
            { label: 'Facturas', path: '/estacionamiento/facturas' },
        ],
    },
    {
        id: 'configuraciones',
        label: 'Configuraciones',
        icon: <Settings size={22} />,
        children: [
            { label: 'Estacionamientos', path: '/estacionamientos/listado' },
            { label: 'Usuarios de sistema', path: '/usuarios-sistema/listado' },
            { label: 'Usuarios de aplicaciones', path: '/usuariosapp/listado' },
        ],
    },
    {
        id: 'pruebas',
        label: 'Pruebas API',
        icon: <FlaskConical size={22} />,
        children: [
            { label: 'Consola de pruebas', path: '/pruebas/consola' },
        ],
    },
]

export default menuItems
