import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto">
            <div className="flex flex-col items-center mb-8">
                <div className="bg-slate-700 text-white rounded-full w-16 h-16 
                        flex items-center justify-center text-2xl font-bold mb-3">
                    P
                </div>
                <h1 className="text-2xl font-bold text-slate-700">hParking</h1>
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
                    required
                />
                <Input
                    label="Contraseña"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={cargando}
                    required
                />

                {error && (
                    <p className="text-red-500 text-sm text-center bg-red-50 
                    py-2 px-3 rounded-lg">
                        {error}
                    </p>
                )}
                <Button
                    texto="Iniciar Sesión"
                    type="submit"
                    tamanio="lg"
                    disabled={cargando}
                    cargando={cargando} />
            </form>

        </div>

    )
}

export default LoginForm;