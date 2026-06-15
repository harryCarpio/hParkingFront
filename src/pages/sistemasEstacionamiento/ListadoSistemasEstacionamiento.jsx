import { ChevronLeft, ExternalLink, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from 'react'
import { crearSistemaEstacionamiento, editarSistemaEstacionamiento, eliminarSistemaEstacionamiento, getSistemasEstacionamiento } from "../../services/sistemasEstacionamientoService";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Pagination from "../../components/ui/Pagination";
import { temas } from "../../styles/temas";
import Table from "../../components/ui/Table";
import ModalFormCrearEditarSistemasEst from "../../components/sistemaEstacionamientos/ModalFormCrearEditarSistemasEst";
import ModalConfirmacion from '../../components/ui/ModalConfirmacion'
import { getEstacionamientos } from "../../services/parkingService";
import { useDiccionarioDatos } from "../../hooks/useDiccionarioDatos";
import { FALLBACKS, getEntityStatus, labelFromKey } from "../../services/diccionarioDatos";
import { useNavigate, useParams } from "react-router-dom";



const ListadoSistemasEstacionamiento = () => {
    const [datos, setDatos] = useState([])
    const [paginaActual, setPaginaActual] = useState(0)
    const [totalPaginas, setTotalPaginas] = useState(0)
    const [totalElementos, setTotalElementos] = useState(0)
    const [porPagina, setPorPagina] = useState(20) //cuantos regsitros x pagina
    const [cargando, setCargando] = useState(false)
    const [modalAbierto, setModalAbiert] = useState(false)
    const [sistemaSeleccionado, setSistemaSeleccionado] = useState(null)
    const [guardandoEntidad, setGuardandoEntidad] = useState(false)
    const [modalEliminarAbierto, setModalEliminarAbiert] = useState(false)
    const [errorMensaje, setErrorMensaje] = useState(null)
    const navigate = useNavigate()
    //lamamos al hook de useDiccionario, para poder mostrar el texto correspondiente
    const estadoEntidadesLabel = useDiccionarioDatos(getEntityStatus, FALLBACKS.getEntityStatus)
    //para poder ver el nombre del estacionamineto por el momneto
    const [parkings, setParkings] = useState([])
    const { id: parkingId } = useParams()

    const cargar = async (pagina = 0, size) => {
        setCargando(true)
        try {
            const { data } = await getSistemasEstacionamiento(pagina, size, { parkingId })
            setDatos(data.content)
            setPaginaActual(data.number)
            setTotalPaginas(data.totalPages)
            setTotalElementos(data.totalElements)
        } catch (error) {
            console.error(error.response?.data)
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        const cargarParkings = async () => {
            try {
                const { data } = await getEstacionamientos(0, 100)
                setParkings(data.content)
            } catch (error) {
                console.error(error)
            }
        }
        cargarParkings()
    }, [])

    useEffect(() => {
        cargar(0, porPagina)
    }, [porPagina])

    //se setean las variables
    const handleNuevo = () => {
        setSistemaSeleccionado(null)
        setModalAbiert(true)
    }

    const handleEditar = (sistema) => {

        setSistemaSeleccionado(sistema)
        setModalAbiert(true)
    }

    const handleEliminar = (sistema) => {
        setSistemaSeleccionado(sistema)
        setModalEliminarAbiert(true)
    }

    const cerrarModal = () => {
        setModalAbiert(false)
        setSistemaSeleccionado(null)
        setModalEliminarAbiert(false)
        setErrorMensaje(null)
    }

    ///llamada a los servicios
    const handleSubmit = async (form) => {
        setGuardandoEntidad(true)
        try {
            if (sistemaSeleccionado) {
                await editarSistemaEstacionamiento(sistemaSeleccionado.id, form)
            } else {
                await crearSistemaEstacionamiento(form)
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
            await eliminarSistemaEstacionamiento(sistemaSeleccionado.id);
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
                    <button title="Ver Operaciones" className={`${temas.tabla.acciones.base} ${temas.tabla.acciones.ver}`}
                        onClick={() => navigate(`/estacionamientos/sistemas/${fila.id}/operaciones`)}>
                        <Eye size={16} />
                    </button>
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
            key: "parkingId", label: "Estacionamiento",
            render: (fila) => (
                <span>{parkings.find(p => p.id === fila.parkingId)?.name ?? fila.parkingId}</span>
            )
        },
        { key: "apiUser", label: "Usuario API" },
        { key: "providerName", label: "Proveedor" },
        {
            key: "url",
            label: "URL",
            render: (fila) => (
                <a href={fila.url} target="_blank" rel="noopener noreferrer" className="text-celestevr hover:underline flex items-center gap-1">
                    <ExternalLink size={14} />
                    {fila.url}
                </a>
            )
        },
        {
            key: "supportEmail",
            label: "Información Soporte",
            render: (fila) => (
                <div className="flex flex-col gap-1 text-sm">
                    <span><span className="font-medium ">Correo:</span> {fila.supportEmail}</span>
                    <span><span className="font-medium ">Teléfono:</span> {fila.supportPhone}</span>
                    <span><span className="font-medium ">Encargado:</span> {fila.supportName}</span>
                </div>
            )
        },
        {
            key: "status",
            label: "Estado",
            render: (fila) => {
                return <span>{labelFromKey(estadoEntidadesLabel.options, fila.status)}</span>
            },
        }
    ]
    return (
        <div className="flex flex-col gap-4 ">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate('/estacionamientos/listado')}
                        className={`flex items-center gap-1 text-sm text-celestevr font-bold `}
                    >
                        <ChevronLeft size={18} />
                        Volver
                    </button>

                </div>

                <h1 className={`text-md ${temas.texto.textoNegritaAzul} `}>
                    Listado de sistemas — {parkings.find(p => p.id === Number(parkingId))?.name ?? 'Estacionamiento'}
                </h1>
                <div>
                    {totalElementos === 0 && !cargando && (
                        <Button
                            texto="Agregar Sistema"
                            icono={<Plus size={15} />}
                            tamanio="sm"
                            onClick={() => handleNuevo()} />
                    )}

                </div>



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
                <ModalFormCrearEditarSistemasEst
                    sistemaParking={sistemaSeleccionado}
                    onClose={cerrarModal}
                    onSubmit={handleSubmit}
                    cargando={guardandoEntidad}
                    parkingId={parkingId}
                    mensajeError={errorMensaje}
                />

            )}

            {modalEliminarAbierto && (
                <ModalConfirmacion
                    subtitle="Sistema"
                    mensaje="¿Está seguro que desea eliminar este registro?"
                    subMensaje="Esta acción no se puede deshacer"
                    onConfirmar={handleConfirmarEliminar}
                    onCancelar={cerrarModal}
                    cargando={guardandoEntidad}>
                    <span><strong>Usuario API:</strong> {sistemaSeleccionado?.apiUser}</span>
                    <span><strong>Proveedor:</strong> {sistemaSeleccionado?.providerName}</span>

                </ModalConfirmacion>
            )}

        </div>
    )
}

export default ListadoSistemasEstacionamiento