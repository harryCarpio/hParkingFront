import React, { useState } from 'react'
import { AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setCargando(true);
        try {
            await login(email, password);
            navigate("/panelAdministracion");
        } catch (err) {       
            setError(err.message || "Ocurrión un error al iniciar sesión");
            console.log("Status:", err.response?.status);
    console.log("Data:", err.response?.data);
    console.log("Error completo:", err);
    console.log("Detail:", err.response?.data?.detail);
console.log("ErrorCode:", err.response?.data?.errorCode);
    
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm border border-emerald-100/60 rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-lg mx-auto">
            <div className="flex flex-col items-center mb-8">
                <div className="bg-white border border-emerald-100 shadow-md shadow-emerald-100/50 rounded-full w-16 h-16
                        flex items-center justify-center mb-3">
                    <img src="/logo.svg" alt="hParking" className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold text-emerald-700">hParking</h1>
                <p className="text-gray-500 text-sm mt-1">Administración</p>
            </div>
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <Input
                    label="Usuario"
                    type="text"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={cargando}
                    icono={<Mail size={16} />}
                    required
                />
                <Input
                    label="Contraseña"
                    type={mostrarPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={cargando}
                    icono={<Lock size={16} />}
                    accionDerecha={(
                        <button
                            type="button"
                            onClick={() => setMostrarPassword((prev) => !prev)}
                            disabled={cargando}
                            tabIndex={-1}
                            className="text-gray-400 hover:text-emerald-700 transition disabled:cursor-not-allowed"
                        >
                            {mostrarPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    )}
                    required
                />

                {error && (
                    <p className="flex items-center gap-2 text-red-500 text-sm text-center bg-red-50
                    py-2 px-3 rounded-lg">
                        <AlertCircle size={16} className="shrink-0" />
                        {error}
                    </p>
                )}
                <Button
                    texto="Iniciar Sesión"
                    type="submit"
                    variante="emerald"
                    tamanio="lg"
                    disabled={cargando}
                    cargando={cargando} />
            </form>

        </div>

    )
}

export default LoginForm;