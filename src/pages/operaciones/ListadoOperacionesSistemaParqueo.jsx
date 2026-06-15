import React, { useEffect, useState } from 'react'
import { crearOperacionSistema, editarOperacionSistema, eliminarOperacionSistema, getOperacionesSistemaParqueo } from '../../services/parkingSystemOperations'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Pagination from '../../components/ui/Pagination'
import Table from '../../components/ui/Table'
import { temas } from '../../styles/temas'
import { ChevronLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import { getSistemasEstacionamiento } from '../../services/sistemasEstacionamientoService'
import ModalFormCrearEditarOperacionesSis from '../../components/operacionesEstacionamientos/ModalFormCrearEditarOperacionesSis'
import ModalConfirmacion from '../../components/ui/ModalConfirmacion'
import { useDiccionarioDatos } from '../../hooks/useDiccionarioDatos'
import { FALLBACKS, getEntityStatus, getParkingSystemOperationTypes, labelFromKey } from '../../services/diccionarioDatos'
import { useNavigate, useParams } from 'react-router-dom'





const ListadoOperacionesSistemaParqueo = () => {
    const [datos, setDatos] = useState([])
    const [paginaActual, setPaginaActual] = useState(0)
    const [totalPaginas, setTotalPaginas] = useState(0)
    const [totalElementos, setTotalElementos] = useState(0)
    const [porPagina, setPorPagina] = useState(20) //cuantos regsitros x pagina
    const [cargando, setCargando] = useState(false)
    const [modalAbierto, setModalAbiert] = useState(false)
    const [operacionSistemaSeleccionado, setOperacionSistemaSeleccionado] = useState(null)
    const [guardandoEntidad, setGuardandoEntidad] = useState(false)
    const [modalEliminarAbierto, setModalEliminarAbiert] = useState(false)
    const [errorMensaje, setErrorMensaje] = useState(null)
    const navigate = useNavigate()
    //lamamos al hook de useDiccionario, para poder mostrar el texto correspondiente
    const estadoEntidadesLabel = useDiccionarioDatos(getEntityStatus, FALLBACKS.getEntityStatus)
    const tipoOperacionesLabel = useDiccionarioDatos(getParkingSystemOperationTypes, FALLBACKS.getParkingSystemOperationTypes)

    //para poder ver el nombre del estacionamineto por el momneto
    const [sistemas, setSistemas] = useState([])
    const { id: parkingSystemId } = useParams()

    const cargar = async (pagina = 0, size) => {
        setCargando(true)
        try {
            const { data } = await getOperacionesSistemaParqueo(pagina, size, { parkingSystemId })
            setDatos(data.content)
            setPaginaActual(data.number)
            setTotalPaginas(data.totalPages)
            setTotalElementos(data.totalElements)
        } catch (error) {
            console.error(error)
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        const cargarSistemas = async () => {
            try {
                const { data } = await getSistemasEstacionamiento(0, 100)
                setSistemas(data.content)
            } catch (error) {
                console.error(error)
            }
        }
        cargarSistemas()
    }, [])


    useEffect(() => {
        cargar(0, porPagina)
    }, [porPagina])

    //se setean las variables
    const handleNuevo = () => {
        setOperacionSistemaSeleccionado(null)
        setModalAbiert(true)
    }

    const handleEditar = (sistema) => {
        setOperacionSistemaSeleccionado(sistema)
        setModalAbiert(true)
    }

    const handleEliminar = (sistema) => {
        setOperacionSistemaSeleccionado(sistema)
        setModalEliminarAbiert(true)
    }

    const cerrarModal = () => {
        setModalAbiert(false)
        setOperacionSistemaSeleccionado(null)
        setModalEliminarAbiert(false)
        setErrorMensaje(null)
    }

    ///llamada a los servicios
    const handleSubmit = async (form) => {
        setGuardandoEntidad(true)
        try {
            if (operacionSistemaSeleccionado) {
                await editarOperacionSistema(operacionSistemaSeleccionado.id, form)
            } else {
                await crearOperacionSistema(form)
            }
            cerrarModal()
            cargar(paginaActual, porPagina);
        } catch (error) {
            const errores = error.response?.data?.errors
            if (errores?.length) {
                setErrorMensaje(errores.map(e => e.issue).join(', '))
            }
            console.error(error.response?.data)
        } finally {
            setGuardandoEntidad(false)
        }
    }

    const handleConfirmarEliminar = async () => {
        setGuardandoEntidad(true)
        try {
            await eliminarOperacionSistema(operacionSistemaSeleccionado.id);
            cerrarModal()
            cargar(paginaActual, porPagina)
        } catch (error) {
            console.error(error)

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
        {
            key: "parkingSystemId", label: "Usuario API",
            render: (fila) => (
                <span>{sistemas.find(s => s.id === fila.parkingSystemId)?.apiUser ?? fila.parkingSystemId}</span>
            )
        },
        {
            key: "operationType",
            label: "Tipo Operación",
            render: (fila) => {
                return <span>{labelFromKey(tipoOperacionesLabel.options, fila.operationType)}</span>
            }
        },
        { key: "endpoint", label: "Endpoint" },
        { key: "httpMethod", label: "Métodos HTTP" },
        {
            key: "status",
            label: "Estado",
            render: (fila) => {
                return <span>{labelFromKey(estadoEntidadesLabel.options, fila.status)}</span>
            }
        },

    ]
    return (
        <div className="flex flex-col gap-4 ">

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex items-center gap-1 text-sm text-celestevr font-bold `}
                    >
                        <ChevronLeft size={18} />
                        Volver
                    </button>

                </div>

                <h1 className={`text-md ${temas.texto.textoNegritaAzul} `}>
                    Listado de operaciones — {sistemas.find(p => p.id === Number(parkingSystemId))?.apiUser ?? 'Usuario'}
                </h1>

                <Button
                    texto="Agregar Operación"
                    icono={<Plus size={15} />}
                    tamanio="sm"
                    onClick={() => handleNuevo()} />

            </div>           

            {cargando ? (
                <Spinner texto="Cargando datos..." />
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
                <ModalFormCrearEditarOperacionesSis
                    operacionSistema={operacionSistemaSeleccionado}
                    onClose={cerrarModal}
                    onSubmit={handleSubmit}
                    cargando={guardandoEntidad}
                    parkingSystemId = {parkingSystemId}
                    mensajeError={errorMensaje}
                />
            )}
            {modalEliminarAbierto && (
                <ModalConfirmacion
                    subtitle="Operaciones"
                    mensaje="¿Está seguro que desea eliminar este registro?"
                    subMensaje="Esta acción no se puede deshacer"
                    onConfirmar={handleConfirmarEliminar}
                    onCancelar={cerrarModal}
                    cargando={guardandoEntidad}>

                    <span><strong>Tipo operación:</strong> {operacionSistemaSeleccionado?.operationType}</span>
                    <span><strong>Método Http:</strong> {operacionSistemaSeleccionado?.httpMethod}</span>

                </ModalConfirmacion>
            )

            }
        </div>
    )
}

export default ListadoOperacionesSistemaParqueo