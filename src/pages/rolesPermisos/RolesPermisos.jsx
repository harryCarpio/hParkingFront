import React, { useEffect, useMemo, useState } from 'react'
import { RotateCcw, ShieldCheck, X } from 'lucide-react'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import ModalConfirmacion from '../../components/ui/ModalConfirmacion'
import TarjetaDominioPermisos from '../../components/rolesPermisos/TarjetaDominioPermisos'
import { agruparPorDominio, coincidePermiso, esComodin } from '../../components/rolesPermisos/permisosUtils'
import { temas } from '../../styles/temas'
import {
  actualizarPermisosRol, getCatalogoPermisos, getRolesPermisos, restaurarPermisosRol,
} from '../../services/rolPermisosService'

const ROLES = [
  { key: 'ROLE_OPERATOR', label: 'Operador' },
  { key: 'ROLE_CITIZEN', label: 'Ciudadano' },
  { key: 'ROLE_ADMIN', label: 'Administrador' },
]

const mensajeError = (error, porDefecto) => {
  const errores = error.response?.data?.errors
  return errores?.length ? errores.map((e) => e.issue).join(' ') : porDefecto
}

const cubre = (otorgados, permiso) => otorgados.some((otorgado) => coincidePermiso(otorgado, permiso))

const RolesPermisos = () => {
  const [catalogo, setCatalogo] = useState([])
  const [roles, setRoles] = useState([])
  const [rolActivo, setRolActivo] = useState('ROLE_OPERATOR')
  const [borrador, setBorrador] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [errorMensaje, setErrorMensaje] = useState(null)
  const [exitoMensaje, setExitoMensaje] = useState(null)
  const [confirmacion, setConfirmacion] = useState(null) // 'guardar' | 'restaurar' | null

  useEffect(() => {
    Promise.all([getCatalogoPermisos(), getRolesPermisos()])
      .then(([respuestaCatalogo, respuestaRoles]) => {
        setCatalogo(respuestaCatalogo.data)
        setRoles(respuestaRoles.data)
        setBorrador(respuestaRoles.data.find((r) => r.authority === 'ROLE_OPERATOR')?.permissions ?? [])
      })
      .catch((error) => {
        setErrorMensaje(mensajeError(error, 'No se pudieron cargar los permisos.'))
        console.error(error.response?.data)
      })
      .finally(() => setCargando(false))
  }, [])

  const rol = roles.find((r) => r.authority === rolActivo)
  const original = useMemo(() => rol?.permissions ?? [], [rol])
  const agregados = borrador.filter((p) => !original.includes(p))
  const quitados = original.filter((p) => !borrador.includes(p))
  const hayCambios = agregados.length > 0 || quitados.length > 0
  const asignables = catalogo.filter((item) => item.assignable)
  const grupos = agruparPorDominio(asignables)
  const dominios = new Set(grupos.map(([dominio]) => dominio))
  //comodines que no son de dominio completo (ej. atm:charge:*), creados via API
  const otrosComodines = borrador.filter((p) => esComodin(p) && !(p.split(':').length === 2 && dominios.has(p.split(':')[0])))
  const efectivosBorrador = asignables.filter((item) => cubre(borrador, item.permission))
  //permisos sensibles que el cambio otorga y que antes no estaban cubiertos
  const sensiblesNuevos = catalogo.filter((item) => item.sensitive && cubre(borrador, item.permission) && !cubre(original, item.permission))

  const seleccionarRol = (clave) => {
    if (hayCambios || guardando) return
    setRolActivo(clave)
    setBorrador(roles.find((r) => r.authority === clave)?.permissions ?? [])
    setErrorMensaje(null)
    setExitoMensaje(null)
  }

  const modificar = (nuevo) => {
    setBorrador([...new Set(nuevo)].sort())
    setExitoMensaje(null)
    setErrorMensaje(null)
  }

  const alternarPermiso = (permiso) => {
    modificar(borrador.includes(permiso) ? borrador.filter((p) => p !== permiso) : [...borrador, permiso])
  }

  //al activar el comodin se quitan los permisos individuales del dominio (redundantes); al desactivarlo se
  //marcan todos los individuales para no quitar acceso sin querer (luego se pueden desmarcar)
  const alternarDominio = (dominio, items) => {
    const comodin = `${dominio}:*`
    const delDominio = (p) => p.startsWith(`${dominio}:`)
    if (borrador.includes(comodin)) {
      modificar([...borrador.filter((p) => p !== comodin), ...items.map((item) => item.permission)])
    } else {
      modificar([...borrador.filter((p) => !delDominio(p)), comodin])
    }
  }

  const aplicarRespuesta = (data, mensaje) => {
    setRoles((prev) => prev.map((r) => (r.authority === data.authority ? data : r)))
    setBorrador(data.permissions)
    setExitoMensaje(mensaje)
  }

  const guardar = async () => {
    setGuardando(true)
    setErrorMensaje(null)
    try {
      const { data } = await actualizarPermisosRol(rolActivo, borrador)
      aplicarRespuesta(data, 'Permisos actualizados. Aplican desde la siguiente acción de los usuarios del rol.')
    } catch (error) {
      setErrorMensaje(mensajeError(error, 'No se pudieron guardar los permisos.'))
      console.error(error.response?.data)
    } finally {
      setGuardando(false)
      setConfirmacion(null)
    }
  }

  const restaurar = async () => {
    setGuardando(true)
    setErrorMensaje(null)
    try {
      const { data } = await restaurarPermisosRol(rolActivo)
      aplicarRespuesta(data, 'Se restauraron los permisos por defecto del rol.')
    } catch (error) {
      setErrorMensaje(mensajeError(error, 'No se pudieron restaurar los permisos.'))
      console.error(error.response?.data)
    } finally {
      setGuardando(false)
      setConfirmacion(null)
    }
  }

  if (cargando) return <Spinner texto="Cargando permisos.." />

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className={`text-md ${temas.texto.textoNegritaAzul}`}>Roles y permisos</h1>
        <p className="text-xs text-gray-500">
          Define qué puede hacer cada rol. Los cambios aplican desde la siguiente acción de los usuarios, sin volver a iniciar sesión.
        </p>
      </div>

      {/*Pestañas de rol*/}
      <div className="flex gap-2 border-b border-gray-200" role="tablist">
        {ROLES.map((r) => (
          <button
            key={r.key}
            role="tab"
            aria-selected={rolActivo === r.key}
            disabled={(hayCambios && rolActivo !== r.key) || guardando}
            title={hayCambios && rolActivo !== r.key ? 'Guarda o descarta los cambios antes de cambiar de rol' : undefined}
            onClick={() => seleccionarRol(r.key)}
            className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
              ${rolActivo === r.key ? 'border-celestevr text-celestevr' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {errorMensaje && <p className={temas.texto.textoErrorFormulario} role="alert">{errorMensaje}</p>}
      {exitoMensaje && (
        <p className="flex items-center justify-center gap-2 text-sm text-emerald-700 bg-emerald-50 py-2 px-3 rounded-lg" role="status">
          <ShieldCheck size={16} /> {exitoMensaje}
        </p>
      )}

      {rol && !rol.editable && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-2">
          <p className="text-sm font-semibold text-slate-700">Acceso total (<code>*</code>)</p>
          <p className="text-sm text-gray-500">
            Los administradores siempre tienen todos los permisos ({rol.effectivePermissions.length}). Este rol no se puede
            editar para evitar que el sistema quede sin administradores con acceso completo.
          </p>
        </div>
      )}

      {rol?.editable && (
        <>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500">
            <span>{efectivosBorrador.length} de {asignables.length} permisos efectivos</span>
            {otrosComodines.length > 0 && (
              <span className="flex items-center gap-2 flex-wrap">
                Otros comodines:
                {otrosComodines.map((comodin) => (
                  <span key={comodin} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-mono">
                    {comodin}
                    <button type="button" aria-label={`Quitar ${comodin}`} disabled={guardando}
                      onClick={() => alternarPermiso(comodin)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {grupos.map(([dominio, items]) => (
              <TarjetaDominioPermisos
                key={dominio}
                dominio={dominio}
                items={items}
                otorgados={borrador}
                onAlternarPermiso={alternarPermiso}
                onAlternarDominio={alternarDominio}
                disabled={guardando}
              />
            ))}
          </div>

          {/*Barra de acciones*/}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur border border-gray-200 rounded-xl px-4 py-3
            flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <span className="text-sm text-gray-600">
              {hayCambios
                ? <>Cambios sin guardar: <span className="text-emerald-700 font-semibold">+{agregados.length}</span> / <span className="text-red-600 font-semibold">−{quitados.length}</span></>
                : 'Sin cambios'}
            </span>
            <div className="flex flex-wrap gap-2">
              <Button texto="Restaurar por defecto" variante="secondary" tamanio="md" icono={<RotateCcw size={14} />}
                onClick={() => setConfirmacion('restaurar')} disabled={guardando || hayCambios} />
              <Button texto="Descartar" variante="secondary" tamanio="md" onClick={() => modificar(original)}
                disabled={!hayCambios || guardando} />
              <Button texto="Guardar" variante="primary" tamanio="md" onClick={() => setConfirmacion('guardar')}
                disabled={!hayCambios || guardando} />
            </div>
          </div>
        </>
      )}

      {confirmacion === 'guardar' && (
        <ModalConfirmacion
          title="Guardar permisos"
          subtitle={ROLES.find((r) => r.key === rolActivo)?.label}
          mensaje="¿Aplicar estos cambios? Afectan de inmediato a todos los usuarios del rol."
          subMensaje={sensiblesNuevos.length > 0
            ? `Atención: se otorgan permisos sensibles (${sensiblesNuevos.map((s) => s.permission).join(', ')}) que permiten administrar usuarios.`
            : undefined}
          textoConfirmar="Guardar"
          varianteConfirmar="primary"
          cargando={guardando}
          onConfirmar={guardar}
          onCancelar={() => setConfirmacion(null)}
        >
          {agregados.map((p) => <span key={`+${p}`} className="font-mono text-emerald-700">+ {p}</span>)}
          {quitados.map((p) => <span key={`-${p}`} className="font-mono text-red-600">− {p}</span>)}
        </ModalConfirmacion>
      )}

      {confirmacion === 'restaurar' && (
        <ModalConfirmacion
          title="Restaurar permisos por defecto"
          subtitle={ROLES.find((r) => r.key === rolActivo)?.label}
          mensaje="Se reemplazarán los permisos actuales del rol por los valores con los que se instaló el sistema."
          textoConfirmar="Restaurar"
          varianteConfirmar="danger"
          cargando={guardando}
          onConfirmar={restaurar}
          onCancelar={() => setConfirmacion(null)}
        />
      )}
    </div>
  )
}

export default RolesPermisos
