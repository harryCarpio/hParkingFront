import React, { useEffect, useState } from 'react'
import { useDiccionarioDatos } from '../../hooks/useDiccionarioDatos'
import { FALLBACKS, getSystemUserAuthority, getUserStatus, labelFromKey } from '../../services/diccionarioDatos'
import { crearUsuarioSistema, editarUsuarioSistema, eliminarUsuarioSistema, getUsuariosSistema } from '../../services/systemUsersService'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Pagination from '../../components/ui/Pagination'
import Table from '../../components/ui/Table'
import ModalFormCrearEditarSistemasEst from '../../components/sistemaEstacionamientos/ModalFormCrearEditarSistemasEst'
import ModalConfirmacion from '../../components/ui/ModalConfirmacion'
import { temas } from '../../styles/temas'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { limpiarForm } from '../../utils/formUtils'
import ModalFormCrearEditarUsuariosSistemas from '../../components/usuariosSistema/ModalFormCrearEditarUsuariosSistemas'

const ListadoUsuariosSistema = () => {
  const [datos, setDatos] = useState([])
  const [paginaActual, setPaginaActual] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [totalElementos, setTotalElementos] = useState(0)
  const [porPagina, setPorPagina] = useState(10) //cuantos regsitros x pagina
  const [cargando, setCargando] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [usuarioSistemaSeleccionado, setUsuarioSistemaSeleccionado] = useState(null)
  const [guardandoEntidad, setGuardandoEntidad] = useState(false)
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false)
  const [errorMensaje, setErrorMensaje] = useState(null)
  //lamamos al hook de useDiccionario, para poder mostrar el texto correspondiente
  const estadoEntidadesLabel = useDiccionarioDatos(getUserStatus, FALLBACKS.getStatusUser)
  const authoritiesLabel = useDiccionarioDatos(getSystemUserAuthority, FALLBACKS.getSystemUserAuthority)
  const cargar = async (pagina = 0, size) => {
    setCargando(true)
    try {
      const { data } = await getUsuariosSistema(pagina, size)
      setDatos(data.content)
      setPaginaActual(data.number)
      setTotalPaginas(data.totalPages)
      setTotalElementos(data.totalElements)
    } catch (error) {
      const errores = error.response?.data?.errors
      if (errores?.length) {
        setErrorMensaje(errores.map(e => e.issue).join(', '))
      }
      console.error(error.response?.data)
    } finally {
      setCargando(false)
    }

  }

  useEffect(() => {
    cargar(0, porPagina)
  }, [porPagina])

  const handleNuevo = () => {
    setUsuarioSistemaSeleccionado(null)
    setModalAbierto(true)
  }

  const handleEditar = (usuario) => {
    setUsuarioSistemaSeleccionado(usuario)
    setModalAbierto(true)
  }
  const handleEliminar = (usuario) => {
    setUsuarioSistemaSeleccionado(usuario)
    setModalEliminarAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setUsuarioSistemaSeleccionado(null)
    setModalEliminarAbierto(false)
    setErrorMensaje(null)
  }

  ///llamada a los servicios
  const handleSubmit = async (form) => {
    setGuardandoEntidad(true)
    const formLimpio = limpiarForm(form)
    try {
      if (usuarioSistemaSeleccionado) {
        await editarUsuarioSistema(usuarioSistemaSeleccionado.id, formLimpio)
      } else {
        await crearUsuarioSistema(formLimpio)
      }
      cerrarModal()
      cargar(paginaActual, porPagina);
    } catch (error) {
      if (error.response?.status === 409) {
        setErrorMensaje("Username ya registrado")
      }
      console.error(error.response?.data)
    } finally {
      setGuardandoEntidad(false)
    }
  }

  const handleConfirmarEliminar = async () => {
    setGuardandoEntidad(true)
    try {
      await eliminarUsuarioSistema(usuarioSistemaSeleccionado.id);
      cerrarModal()
      cargar(paginaActual, porPagina)
    } catch (error) {
      console.error(error.response?.data)

    } finally {
      setGuardandoEntidad(false);
    }
  }

  const columnas = [
    {
      key: "acciones",
      label: "Acciones",
      render: (fila) => (
        <div className="flex gap-2">
          <button title="Editar" className={`${temas.tabla.acciones.base} ${temas.tabla.acciones.editar}`}
            onClick={() => handleEditar(fila)}>
            <Pencil size={16} />
          </button>
          <button title="Eliminar" className={`${temas.tabla.acciones.base} ${temas.tabla.acciones.eliminar}`}
            onClick={() => handleEliminar(fila)}>
            <Trash2 size={16} />
          </button>
        </div>
      )
    },
    { key: "username", label: "Usuario" },
    { key: "description", label: "Descripción" },
    {
      key: "authorities", label: "Grupo",
      render: (fila) => {
        return (
          <div className="flex flex-wrap gap-1">
            {fila.authorities.map((auth) => (
              <span key={auth} className="text-xs px-2 py-0.5 rounded-full bg-celestevr text-white font-medium pointer-events-none">
                {labelFromKey(authoritiesLabel.options, auth)}
              </span>
            ))}
          </div>
        )
      }

    },

    {
      key: "status",
      label: "Estado",
      render: (fila) => {
        return <span>{labelFromKey(estadoEntidadesLabel.options, fila.status)}</span>
      },
    },
  ]



  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex items-center justify-between">
        <h1 className={`text-md ${temas.texto.textoNegritaAzul} `}>
          Lista de usuarios sistema
        </h1>

        <Button
          texto="Nuevo Usuario"
          icono={<Plus size={15} />}
          tamanio="sm"
          onClick={() => handleNuevo()} />

      </div>

      {cargando ? (
        <Spinner texto="Cargando datos.." />
      ) : (
        <>
          <Pagination
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            totalElementos={totalElementos}
            porPagina={porPagina}
            onCambiarPagina={(pagina) => cargar(pagina, porPagina)}
            onCambiarPorPagina={(nuevoSize) => { setPorPagina(nuevoSize) }}
          />
          <Table columnas={columnas} datos={datos} />
        </>
      )}
      {modalAbierto && (
        <ModalFormCrearEditarUsuariosSistemas
          usuarioSistema={usuarioSistemaSeleccionado}
          onClose={cerrarModal}
          onSubmit={handleSubmit}
          cargando={guardandoEntidad}
          mensajeError={errorMensaje}
        />
      )}
      {modalEliminarAbierto && (
        <ModalConfirmacion
          subtitle="Usuario de sistema"
          mensaje="¿Está seguro que desea eliminar este registro?"
          subMensaje="Esta acción no se puede deshacer"
          onConfirmar={handleConfirmarEliminar}
          onCancelar={cerrarModal}
          cargando={guardandoEntidad}>
          <span><strong>Usuario:</strong> {usuarioSistemaSeleccionado?.username}</span>
          <span><strong>Descripción:</strong> {usuarioSistemaSeleccionado?.description}</span>
        </ModalConfirmacion>
      )

      }
    </div>
  )
}

export default ListadoUsuariosSistema