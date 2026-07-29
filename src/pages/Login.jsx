import LoginForm from "../components/login/LoginForm"
import { versionEtiqueta } from "../utils/buildInfo"


const Login = () => {
  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center px-4 overflow-hidden">
        <img
            src="/login-bg2.jpg"
            alt=""
            aria-hidden="true"
            className="hidden lg:block absolute top-0 right-0 h-full w-auto object-cover opacity-40 pointer-events-none select-none
                       [mask-image:linear-gradient(to_right,transparent,black_25%)]
                       [-webkit-mask-image:linear-gradient(to_right,transparent,black_25%)]"
        />
        <div className="relative z-10 w-full">
            <LoginForm/>
        </div>
        <footer className="absolute bottom-4 inset-x-0 z-10 text-center text-xs text-gray-400">
            Powered by VRSoluciones · {versionEtiqueta()}
        </footer>
    </div>
  )
}

export default Login