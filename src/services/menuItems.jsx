import { FlaskConical, Home, ParkingSquare, Settings } from 'lucide-react'
import React from 'react'

const menuItems = [
    {
        id: 'inicio',
        label: 'Inicio',
        icon: <Home size={18} />,
        path: '/panelAdministracion',
        children: [],
    },
    {
        id: 'estacionamiento',
        label: 'Estacionamiento',
        icon: <ParkingSquare size={18} />,
        children: [
            { label: 'Usos', path: '/estacionamiento/usos' },
        ],
    },
    {
        id: 'configuraciones',
        label: 'Configuraciones',
        icon: <Settings size={18} />,
        children: [
            { label: 'Estacionamientos', path: '/estacionamientos/listado' },
            {
                id: 'usuarios',
                label: 'Usuarios',
                children: [
                    { label: 'Usuarios de sistema', path: '/usuarios-sistema/listado' },
                    { label: 'Usuarios de aplicaciones', path: '/usuariosapp/listado' },
                ],
            },
        ],
    },
    {
        id: 'pruebas',
        label: 'Pruebas API',
        icon: <FlaskConical size={18} />,
        children: [
            { label: 'Consola de pruebas', path: '/pruebas/consola' },
        ],
    },
]

export default menuItems
