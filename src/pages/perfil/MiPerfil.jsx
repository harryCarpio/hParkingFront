import React, { useState } from 'react'
import { Check, Circle, Eye, EyeOff, KeyRound, ShieldCheck, UserRound } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { temas } from '../../styles/temas'
import { cambiarContrasenia } from '../../services/cuentaService'

//mismas reglas que valida el backend (AccountService): se repiten aqui solo para guiar al usuario
const MIN_CARACTERES = 12
const MAX_BYTES = 72 //bcrypt solo usa los primeros 72 bytes
const CARACTERES_CONTROL = /\p{Cc}/u

const FORM_VACIO = { actual: '', nueva: '', confirmacion: '' }

const NOMBRES_ROL = {
  ROLE_ADMIN: 'Administrador',
  ROLE_OPERATOR: 'Operador',
  ROLE_CITIZEN: 'Ciudadano',
}

const evaluarReglas = (form, email) => {
  const { actual, nueva, confirmacion } = form
  const correo = (email || '').toLowerCase()
  const usuarioCorreo = correo.split('@')[0]
  const nuevaMinusculas = nueva.toLowerCase()
  const contieneCorreo = Boolean(correo) &&
    (nuevaMinusculas.includes(correo) || (usuarioCorreo.length >= 4 && nuevaMinusculas.includes(usuarioCorreo)))

  return [
    { texto: `Al menos ${MIN_CARACTERES} caracteres`, cumple: [...nueva].length >= MIN_CARACTERES },
    { texto: `Máximo ${MAX_BYTES} bytes (unos ${MAX_BYTES} caracteres sin tildes)`, cumple: nueva.length > 0 && new TextEncoder().encode(nueva).length <= MAX_BYTES },
    { texto: 'Distinta de la contraseña actual', cumple: nueva.length > 0 && nueva !== actual },
    { texto: 'No contiene tu correo', cumple: nueva.length > 0 && !contieneCorreo },
    { texto: 'Sin saltos de línea ni caracteres de control', cumple: nueva.length > 0 && !CARACTERES_CONTROL.test(nueva) },
    { texto: 'La confirmación coincide', cumple: confirmacion.length > 0 && nueva === confirmacion },
  ]
}

//indicador orientativo (no bloquea): la longitud pesa mas que la variedad de caracteres
const evaluarFortaleza = (clave) => {
  if (!clave) return null
  const variedad = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(clave)).length
  const largo = [...clave].length
  const puntos = (largo >= 12 ? 1 : 0) + (largo >= 16 ? 1 : 0) + (largo >= 20 ? 1 : 0) + (variedad >= 3 ? 1 : 0)
  if (largo < MIN_CARACTERES || puntos <= 1) return { nivel: 1, texto: 'Débil', color: 'bg-red-500' }
  if (puntos === 2) return { nivel: 2, texto: 'Aceptable', color: 'bg-amber-500' }
  if (puntos === 3) return { nivel: 3, texto: 'Fuerte', color: 'bg-emerald-500' }
  return { nivel: 4, texto: 'Muy fuerte', color: 'bg-emerald-600' }
}

const BotonVerClave = ({ visible, onClick }) => (
  <button type="button" onClick={onClick} className="text-gray-400 hover:text-gray-600 cursor-pointer"
    aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} title={visible ? 'Ocultar' : 'Mostrar'}>
    {visible ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
)

const MiPerfil = () => {
  const { usuario, reemplazarTokens } = useAuth()
  const [form, setForm] = useState(FORM_VACIO)
  const [visibles, setVisibles] = useState({ actual: false, nueva: false, confirmacion: false })
  const [guardando, setGuardando] = useState(false)
  const [errorMensaje, setErrorMensaje] = useState(null)
  const [exito, setExito] = useState(false)

  const reglas = evaluarReglas(form, usuario?.email)
  const formularioValido = form.actual.length > 0 && reglas.every((r) => r.cumple)
  const fortaleza = evaluarFortaleza(form.nueva)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrorMensaje(null)
    setExito(false)
  }

  const alternarVisible = (campo) => setVisibles((prev) => ({ ...prev, [campo]: !prev[campo] }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formularioValido || guardando) return
    setGuardando(true)
    setErrorMensaje(null)
    try {
      const { data } = await cambiarContrasenia(form.actual, form.nueva)
      //el backend invalida todos los tokens anteriores: esta sesion continua con los nuevos
      reemplazarTokens(data)
      setForm(FORM_VACIO)
      setVisibles({ actual: false, nueva: false, confirmacion: false })
      setExito(true)
    } catch (error) {
      const errores = error.response?.data?.errors
      setErrorMensaje(errores?.length
        ? errores.map((err) => err.issue).join(', ')
        : 'No se pudo cambiar la contraseña. Inténtalo nuevamente.')
      //no se registra el body de la solicitud: contiene las contraseñas
      console.error(error.response?.data)
    } finally {
      setGuardando(false)
    }
  }

  const roles = (usuario?.roles ?? []).map((rol) => NOMBRES_ROL[rol] ?? rol)

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      <h1 className={`text-md ${temas.texto.textoNegritaAzul}`}>Mi perfil</h1>

      {/*Datos de la cuenta*/}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <UserRound size={18} /> Datos de la cuenta
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-x-6 gap-y-3 text-sm">
          <dt className="text-gray-400 font-medium">Nombre</dt>
          <dd className="text-gray-800">{usuario?.name || '—'}</dd>
          <dt className="text-gray-400 font-medium">Correo</dt>
          <dd className="text-gray-800 break-all">{usuario?.email || '—'}</dd>
          <dt className="text-gray-400 font-medium">Rol</dt>
          <dd className="text-gray-800">{roles.length ? roles.join(', ') : '—'}</dd>
        </dl>
      </section>

      {/*Cambio de contraseña*/}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <KeyRound size={18} /> Cambiar contraseña
          </h2>
          <p className="text-xs text-gray-500">
            Al cambiarla se cerrará la sesión en tus otros dispositivos. Esta sesión seguirá abierta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {/*permite a los gestores de contraseñas asociar la nueva clave a esta cuenta*/}
          <input type="text" name="username" autoComplete="username" value={usuario?.email ?? ''} readOnly hidden />

          <Input label="Contraseña actual" name="actual" type={visibles.actual ? 'text' : 'password'}
            value={form.actual} onChange={handleChange} disabled={guardando} required
            autoComplete="current-password" maxLength={256}
            accionDerecha={<BotonVerClave visible={visibles.actual} onClick={() => alternarVisible('actual')} />} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Input label="Nueva contraseña" name="nueva" type={visibles.nueva ? 'text' : 'password'}
                value={form.nueva} onChange={handleChange} disabled={guardando} required
                autoComplete="new-password" maxLength={256} aria-describedby="reglas-contrasenia"
                accionDerecha={<BotonVerClave visible={visibles.nueva} onClick={() => alternarVisible('nueva')} />} />
              {fortaleza && (
                <div className="flex items-center gap-2" aria-live="polite">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((n) => (
                      <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= fortaleza.nivel ? fortaleza.color : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 w-20 text-right">{fortaleza.texto}</span>
                </div>
              )}
            </div>
            <Input label="Confirmar nueva contraseña" name="confirmacion" type={visibles.confirmacion ? 'text' : 'password'}
              value={form.confirmacion} onChange={handleChange} disabled={guardando} required
              autoComplete="new-password" maxLength={256}
              accionDerecha={<BotonVerClave visible={visibles.confirmacion} onClick={() => alternarVisible('confirmacion')} />} />
          </div>

          <ul id="reglas-contrasenia" className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
            {reglas.map((regla) => (
              <li key={regla.texto} className={`flex items-center gap-2 ${regla.cumple ? 'text-emerald-700' : 'text-gray-500'}`}>
                {regla.cumple ? <Check size={14} className="shrink-0" /> : <Circle size={10} className="shrink-0 mx-0.5" />}
                {regla.texto}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400">
            Sugerencia: usa una frase larga y fácil de recordar, o un gestor de contraseñas. Tras 5 intentos con la
            contraseña actual incorrecta la cuenta se bloquea 15 minutos.
          </p>

          {errorMensaje && <p className={temas.texto.textoErrorFormulario} role="alert">{errorMensaje}</p>}
          {exito && (
            <p className="flex items-center justify-center gap-2 text-sm text-emerald-700 bg-emerald-50 py-2 px-3 rounded-lg" role="status">
              <ShieldCheck size={16} /> Contraseña actualizada. Se cerró la sesión en tus otros dispositivos.
            </p>
          )}

          <div className="flex justify-end">
            <Button texto="Cambiar contraseña" type="submit" variante="primary" tamanio="md"
              cargando={guardando} disabled={!formularioValido} />
          </div>
        </form>
      </section>
    </div>
  )
}

export default MiPerfil
