import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import React, { use, useEffect, useState } from 'react'
import { crearEstacionamiento, editarEstacionamiento, eliminarEstacionamiento, getEstacionamientos } from '../../services/parkingService'
import Pagination from '../../components/ui/Pagination'
import Table from '../../components/ui/Table'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import { temas } from '../../styles/temas'
import ModalFormCrearEditarEstacionamientos from '../../components/estacionamientos/ModalFormCrearEditarEstacionamientos'
import ModalConfirmacion from '../../components/ui/ModalConfirmacion'
import { useDiccionarioDatos } from '../../hooks/useDiccionarioDatos'
import { FALLBACKS, getEntityStatus, labelFromKey } from '../../services/diccionarioDatos'
import { useNavigate } from 'react-router-dom'

const ListadoEstacionamientos = () => {
    const [datos, setDatos] = useState([])
    const [paginaActual, setPaginaActual] = useState(0)
    const [totalPaginas, setTotalPaginas] = useState(0)
    const [totalElementos, setTotalElementos] = useState(0)
    const [porPagina, setPorPagina] = useState(10) //cuantos regsitros x pagina
    const [cargando, setCargando] = useState(false)
    const [modalAbierto, setModalAbiert] = useState(false)
    const [parkingSeleccionado, setParkingSeleccionado] = useState(null)
    const [guardandoEntidad, setGuardandoEntidad] = useState(false)
    const [modalEliminarAbierto, setModalEliminarAbiert] = useState(false)
    const [errorMensaje, setErrorMensaje] = useState(null)
    const navigate = useNavigate()
    //lamamos al hook de useDiccionario, para poder mostrar el texto correspondiente
    const estadoEntidades = useDiccionarioDatos(getEntityStatus,FALLBACKS.getEntityStatus)


    //funcion que consulta todos los estacionamientos    
    const cargar = async (pagina = 0, size) => {
        setCargando(true)
        try {
            const { data } = await getEstacionamientos(pagina, size)
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
        cargar(0, porPagina)
    }, [porPagina])

    //se setean las variables
    const handleNuevo = () => {
        setParkingSeleccionado(null)
        setModalAbiert(true)
    }

    const handleEditar = (parking) => {
        setParkingSeleccionado(parking)
        setModalAbiert(true)
    }

    const handleEliminar = (parking) => {
        setParkingSeleccionado(parking)
        setModalEliminarAbiert(true)
    }

    const cerrarModal = () => {
        setModalAbiert(false)
        setParkingSeleccionado(null)
        setModalEliminarAbiert(false)
        setErrorMensaje(null)
    }


    ///llamada a los servicios

    const handleSubmit = async (form) => {
        setGuardandoEntidad(true)
        try {
            if (parkingSeleccionado) {
                await editarEstacionamiento(parkingSeleccionado.id, form)
            } else {
                await crearEstacionamiento(form)
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
            await eliminarEstacionamiento(parkingSeleccionado.id);
            cerrarModal()
            cargar(paginaActual, porPagina)
        } catch (error) {
            const errores = error.response?.data?.errors
            if (errores?.length) {
                setErrorMensaje(errores.map(e => e.issue).join(', '))
            }
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
                    <button title="Ver Sistemas" className={`${temas.tabla.acciones.base} ${temas.tabla.acciones.ver}`}
                      onClick={() => navigate(`/estacionamientos/${fila.id}/sistemas`)}>
                        <Eye size={16} />
                    </button>
                    <button title="Editar" className={`${temas.tabla.acciones.base} ${temas.tabla.acciones.editar}`}
                        onClick={() => handleEditar(fila)}
                    >
                        <Pencil size={16} />
                    </button>
                    <button title="Eliminar" className={`${temas.tabla.acciones.base} ${temas.tabla.acciones.eliminar}`}
                        onClick={() => handleEliminar(fila)}>
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        },

        { key: "name", label: "Nombre" },
        { key: "address", label: "Dirección" },
        { key: "city", label: "Ciudad" },
        { key: "totalCapacity", label: "Capacidad Total" },
        {
            key: "operatingHours", label: "Horario", render: (fila) => (
                <span className="whitespace-pre-line">
                    {fila.operatingHours}
                </span>
            )
        },
        { key: "status",
             label: "Estado" ,
            render:(fila) => {
                return <span>{labelFromKey(estadoEntidades.options, fila.status)}</span>
            }
        },


    ]


    return (
        <div className="flex flex-col gap-4 ">
            <div className="flex items-center justify-between">
                <h1 className={`text-md ${temas.texto.textoNegritaAzul} `}>
                    Listado de estacionamientos
                </h1>

                <Button
                    texto="Agregar Estacionamiento"
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
                <ModalFormCrearEditarEstacionamientos
                    parking={parkingSeleccionado}
                    onClose={cerrarModal}
                    onSubmit={handleSubmit}
                    cargando={guardandoEntidad}
                    mensajeError={errorMensaje}
                     />
            )}

            {modalEliminarAbierto && (
                <ModalConfirmacion
                    subtitle="Estacionamiento"
                    mensaje="¿Está seguro que desea eliminar este registro?"
                    subMensaje="Esta acción no se puede deshacer"
                    onConfirmar={handleConfirmarEliminar}
                    onCancelar={cerrarModal}
                    cargando={guardandoEntidad}>
                    <span><strong>Nombre:</strong> {parkingSeleccionado?.name}</span>
                    <span><strong>Ciudad:</strong> {parkingSeleccionado?.city}</span>
                    <span><strong>Dirección:</strong> {parkingSeleccionado?.address}</span>
                </ModalConfirmacion>


            )}
        </div>
    )
}

export default ListadoEstacionamientos