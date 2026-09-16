import React, { useEffect, useState } from 'react'
import { DollarSign, Search, X, Eye } from 'lucide-react'
import { temas } from '../../styles/temas'
import { getUsosEstacionamiento, getParkingsFiltroUso } from '../../services/parkingUsageService'
import { USAGE_STATUS_OPTIONS, labelFromKey } from '../../services/diccionarioDatos'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import DiccionarioDatosSelect from '../../components/ui/DiccionarioDatosSelect'
import Spinner from '../../components/ui/Spinner'
import Pagination from '../../components/ui/Pagination'
import Table from '../../components/ui/Table'
import PanelDetalleUso from '../../components/usos/PanelDetalleUso'
import CheckoutPagoModal from '../../components/usos/CheckoutPagoModal'

const FILTROS_VACIOS = {
  parkingTicketNumber: '',
  plate: '',
  status: '',
  parkingId: '',
  from: '',
  to: '',
}

//convierte el valor "datetime-local" (hora local del navegador) a ISO-8601 UTC que espera el backend
const aInstanteUtc = (valorLocal) => (
  valorLocal ? new Date(valorLocal).toISOString() : undefined
)

const formatearFecha = (iso) => (
  iso ? new Date(iso).toLocaleString() : '—'
)

const Usos = () => {
  const [datos, setDatos] = useState([])
  const [paginaActual, setPaginaActual] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [totalElementos, setTotalElementos] = useState(0)
  const [porPagina, setPorPagina] = useState(10)
  const [cargando, setCargando] = useState(false)
  const [errorMensaje, setErrorMensaje] = useState(null)
  const [filtros, setFiltros] = useState(FILTROS_VACIOS)
  const [ordenamiento, setOrdenamiento] = useState(null)
  const [parkings, setParkings] = useState([])
  const [usoSeleccionadoId, setUsoSeleccionadoId] = useState(null)
  const [placaCobro, setPlacaCobro] = useState(null)

  const cargar = async (pagina = 0, size = porPagina, filtrosActuales = filtros, ordenamientoActual = ordenamiento) => {
    setCargando(true)
    setErrorMensaje(null)
    try {
      const { data } = await getUsosEstacionamiento(pagina, size, {
        parkingTicketNumber: filtrosActuales.parkingTicketNumber,
        plate: filtrosActuales.plate,
        status: filtrosActuales.status,
        parkingId: filtrosActuales.parkingId,
        from: aInstanteUtc(filtrosActuales.from),
        to: aInstanteUtc(filtrosActuales.to),
        sort: ordenamientoActual ? `${ordenamientoActual.campo},${ordenamientoActual.direccion}` : undefined,
      })
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

  const cargarParkings = async () => {
    try {
      const { data } = await getParkingsFiltroUso()
      setParkings(data)
    } catch (error) {
      console.error(error.response?.data)
    }
  }

  useEffect(() => {
    cargar(0, porPagina)
  }, [porPagina])

  useEffect(() => {
    cargarParkings()
  }, [])

  const handleFiltroChange = (e) => {
    const { name, value } = e.target
    setFiltros((prev) => ({ ...prev, [name]: value }))
  }

  const handleBuscar = (e) => {
    e.preventDefault()
    cargar(0, porPagina, filtros)
  }

  const handleLimpiar = () => {
    setFiltros(FILTROS_VACIOS)
    cargar(0, porPagina, FILTROS_VACIOS)
  }

  const handlePagoCompletado = () => {
    setPlacaCobro(null)
    cargar(paginaActual, porPagina, filtros, ordenamiento)
  }

  const handleOrdenar = (campo) => {
    const nuevoOrdenamiento = {
      campo,
      direccion: ordenamiento?.campo === campo && ordenamiento.direccion === 'asc' ? 'desc' : 'asc',
    }
    setOrdenamiento(nuevoOrdenamiento)
    cargar(0, porPagina, filtros, nuevoOrdenamiento)
  }

  const columnas = [
    { key: 'parkingName', label: 'Estacionamiento' },
    { key: 'parkingTicketNumber', label: 'N° Ticket', ordenable: true },
    { key: 'plate', label: 'Placa', ordenable: true },
    { key: 'entryTime', label: 'Entrada', render: (fila) => formatearFecha(fila.entryTime), ordenable: true },
    { key: 'exitTime', label: 'Salida', render: (fila) => formatearFecha(fila.exitTime), ordenable: true },
    { key: 'status', label: 'Estado', render: (fila) => labelFromKey(USAGE_STATUS_OPTIONS, fila.status), ordenable: true },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (fila) => (
        <div className="flex gap-2">
          <button
            title="Ver detalle"
            className={`${temas.tabla.acciones.base} ${temas.tabla.acciones.ver}`}
            onClick={() => setUsoSeleccionadoId(fila.id)}
          >
            <Eye size={16} />
          </button>
          {fila.status === 'ACTIVE' && (
            <button
              title="Cobrar"
              className={`${temas.tabla.acciones.base} ${temas.tabla.acciones.cobrar}`}
              onClick={() => setPlacaCobro(fila.plate)}
            >
              <DollarSign size={16} />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <h1 className={`text-md ${temas.texto.textoNegritaAzul}`}>
        Usos
      </h1>

      <form onSubmit={handleBuscar} className="flex items-end gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Parqueadero</label>
          <select
            name="parkingId"
            value={filtros.parkingId}
            onChange={handleFiltroChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-50
             focus:outline-none focus:ring-2 focus:ring-blue-900 min-h-[42px]
             disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            <option value="">Todos</option>
            {parkings.map((parking) => (
              <option key={parking.id} value={parking.id}>
                {parking.name}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="N° Ticket"
          name="parkingTicketNumber"
          value={filtros.parkingTicketNumber}
          onChange={handleFiltroChange}
        />
        <Input
          label="Placa"
          name="plate"
          value={filtros.plate}
          onChange={handleFiltroChange}
        />
        <Input
          label="Desde"
          type="datetime-local"
          name="from"
          value={filtros.from}
          onChange={handleFiltroChange}
          max={filtros.to || undefined}
        />
        <Input
          label="Hasta"
          type="datetime-local"
          name="to"
          value={filtros.to}
          onChange={handleFiltroChange}
          min={filtros.from || undefined}
        />
        <DiccionarioDatosSelect
          label="Estado"
          name="status"
          value={filtros.status}
          onChange={handleFiltroChange}
          opcionesQuemadas={USAGE_STATUS_OPTIONS}
          placeHolder="Todos"
        />

        <Button
          type="submit"
          texto="Buscar"
          icono={<Search size={15} />}
          tamanio="md"
          cargando={cargando}
        />
        <Button
          type="button"
          texto="Limpiar"
          icono={<X size={15} />}
          tamanio="md"
          variante="secondary"
          onClick={handleLimpiar}
        />
      </form>

      {errorMensaje && (
        <p className={temas.texto.textoErrorFormulario}>{errorMensaje}</p>
      )}

      {cargando ? (
        <Spinner texto="Cargando datos.." />
      ) : (
        <>
          <Pagination
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            totalElementos={totalElementos}
            porPagina={porPagina}
            onCambiarPagina={(pagina) => cargar(pagina, porPagina, filtros)}
            onCambiarPorPagina={(nuevoSize) => { setPorPagina(nuevoSize) }}
          />
          <Table columnas={columnas} datos={datos} ordenamiento={ordenamiento} onOrdenar={handleOrdenar} />
        </>
      )}

      {usoSeleccionadoId && (
        <PanelDetalleUso
          parkingUsageId={usoSeleccionadoId}
          onClose={() => setUsoSeleccionadoId(null)}
        />
      )}

      {placaCobro && (
        <CheckoutPagoModal
          plate={placaCobro}
          onClose={() => setPlacaCobro(null)}
          onCompletado={handlePagoCompletado}
        />
      )}
    </div>
  )
}

export default Usos
