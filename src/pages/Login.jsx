import LoginForm from "../components/login/LoginForm"
import BackgroundCarousel from "../components/login/BackgroundCarousel"
import { versionEtiqueta } from "../utils/buildInfo"

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-xl border border-gray-200
                       overflow-hidden grid grid-cols-1 lg:grid-cols-2 lg:min-h-[640px]">

        <div className="flex flex-col justify-center px-8 py-10 md:px-16">
          <div className="flex items-center gap-2 mb-10">
            <img src="/logo.svg" alt="hParking" className="w-8 h-8" />
            <span className="text-lg font-bold text-emerald-700">hParking</span>
          </div>

          <div className="w-full max-w-sm mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Bienvenido</h1>
            <p className="text-gray-500 text-sm mb-8">Ingresa tus credenciales para continuar</p>

            <LoginForm />
          </div>

          <p className="text-xs text-gray-400 text-center mt-10">
            Powered by VRSoluciones · {versionEtiqueta()}
          </p>
        </div>

        <div className="hidden lg:block relative">
          <BackgroundCarousel />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10">
            <h2 className="text-3xl font-bold mb-2 text-white">Administra tus parqueaderos</h2>
            <p className="text-white/80 text-sm">
              Consulta usos, facturación y sincronización, todo en un solo lugar.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login
