import { Activity, FlaskConical, Home, ParkingSquare, ServerCog, ShieldUser, Users } from 'lucide-react'
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
        id: 'estacionamientos',
        label: 'Gestión de Estacionamientos',
        icon: <ParkingSquare size={18} />,
        children: [
            { label: 'Listado de estacionamientos', path: '/estacionamientos/listado' },
            { label: 'Crear estacionamientos', path: '/estacionamientos/crear' },
        ],
    },
    
    
    {
        id: 'usuarios-sistema',
        label: 'Gestión de Usuarios de Sistema',
        icon: <ShieldUser size={18} />,
        children: [
            { label: 'Lista de usuarios', path: '/usuarios-sistema/listado' },
        ],
    },
    {
        id: 'usuarios-app',
        label: 'Gestión de Usuarios de Aplicación',
        icon: <Users size={18} />,
        children: [
            { label: 'Lista de usuarios', path: '/usuariosapp/listado' },
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