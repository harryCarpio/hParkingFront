import React, { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Breadcrumb from './Breadcrumb'
import { Outlet } from 'react-router-dom'

//este layout me permite unir el navbar y el sidbar para que sea rehusable en todas las
//vistas que son protegidas
const MainLayout = () => {
    const [sidebarAbierto, setSidebarAbierto] = useState(false)
    return (
        <div className="flex flex-col h-screen">
            <Navbar onMenuClick={() => setSidebarAbierto(prev => !prev)} />
            <div className="flex flex-1 overflow-hidden">                
                {sidebarAbierto && (
                    <div
                        className="fixed inset-0 bg-black/40 z-20 lg:hidden"
                        onClick={() => setSidebarAbierto(false)}
                    />
                )}

                <Sidebar
                    isOpen={sidebarAbierto}
                    onClose={() => setSidebarAbierto(false)}
                />

                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <Breadcrumb />
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout