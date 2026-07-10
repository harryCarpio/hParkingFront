import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeProvider"
import Login from "./pages/Login"
import PanelAdministracion from "./pages/PanelAdministracion"
import ProtectedRoute from "./router/ProtectedRoute"
import MainLayout from "./components/layout/MainLayout"
import EstacionamientosCrear from "./pages/EstacionamientosCrear"
import ListadoUsuariosAplicacion from "./pages/usuariosApp/ListadoUsuariosAplicacion"
import ListadoSistemasEstacionamiento from "./pages/sistemasEstacionamiento/ListadoSistemasEstacionamiento"
import ListadoEstacionamientos from "./pages/estacionamientos/ListadoEstacionamientos"
import ListadoOperacionesSistemaParqueo from "./pages/operaciones/ListadoOperacionesSistemaParqueo"
import ListadoUsuariosSistema from "./pages/usuariosSistema/ListadoUsuariosSistema"
import ListadoPruebasApi from "./pages/pruebasApi/ListadoPruebasApi"
import Usos from "./pages/estacionamiento/Usos"

function App() {


  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path="/panelAdministracion" element={<PanelAdministracion />} />
              <Route path="/estacionamiento/usos" element={<Usos />} />
              <Route path="/estacionamientos/listado" element={<ListadoEstacionamientos />} />
              <Route path="/estacionamientos/crear" element={<EstacionamientosCrear />} />
              <Route path="/estacionamientos/:id/sistemas" element={<ListadoSistemasEstacionamiento />} />
              <Route path="/estacionamientos/sistemas/:id/operaciones" element={<ListadoOperacionesSistemaParqueo />} />
              <Route path="/usuarios-sistema/listado" element={<ListadoUsuariosSistema />} />
              <Route path="/usuariosapp/listado" element={<ListadoUsuariosAplicacion />} />
              <Route path="/pruebas/consola" element={<ListadoPruebasApi />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
