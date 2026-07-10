import React, { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { temas } from '../../styles/temas'
import { getFacturasSyncStatus } from '../../services/invoiceSyncStatusService'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Spinner from '../../components/ui/Spinner'
import Pagination from '../../components/ui/Pagination'
import Table from '../../components/ui/Table'
import BadgeSyncStatus from '../../components/facturas/BadgeSyncStatus'
import ModalDetalleSincronizacion from '../../components/facturas/ModalDetalleSincronizacion'

const FILTROS_VACIOS = {
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

const Facturas = () => {
  const [datos, setDatos] = useState([])
  const [paginaActual, setPaginaActual] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [totalElementos, setTotalElementos] = useState(0)
  const [porPagina, setPorPagina] = useState(10)
  const [cargando, setCargando] = useState(false)
  const [errorMensaje, setErrorMensaje] = useState(null)
  const [filtros, setFiltros] = useState(FILTROS_VACIOS)
  const [syncStatusSeleccionado, setSyncStatusSeleccionado] = useState(null)

  const cargar = async (pagina = 0, size = porPagina, filtrosActuales = filtros) => {
    setCargando(true)
    setErrorMensaje(null)
    try {
      const { data } = await getFacturasSyncStatus(pagina, size, {
        from: aInstanteUtc(filtrosActuales.from),
        to: aInstanteUtc(filtrosActuales.to),
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

  useEffect(() => {
    cargar(0, porPagina)
  }, [porPagina])

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

  const columnas = [
    { key: 'sequenceNumber', label: 'N° Secuencial', render: (fila) => fila.invoice.sequenceNumber },
    { key: 'clientName', label: 'Cliente', render: (fila) => fila.invoice.clientName },
    { key: 'plate', label: 'Placa', render: (fila) => fila.invoice.plate },
    { key: 'billingAt', label: 'Facturado', render: (fila) => formatearFecha(fila.invoice.billingAt) },
    { key: 'externalParkingId', label: 'Parqueadero', render: (fila) => fila.invoice.externalParkingId },
    { key: 'minuteQuantity', label: 'Minutos', render: (fila) => fila.invoice.minuteQuantity },
    { key: 'createdBy', label: 'Creado por' },
    {
      key: 'syncStatuses',
      label: 'Sincronización',
      render: (fila) => (
        <div className="flex gap-2 flex-wrap">
          {fila.syncStatuses.map((syncStatus) => (
            <BadgeSyncStatus
              key={syncStatus.id}
              syncStatus={syncStatus}
              onClick={setSyncStatusSeleccionado}
            />
          ))}
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <h1 className={`text-md ${temas.texto.textoNegritaAzul}`}>
        Facturas
      </h1>

      <form onSubmit={handleBuscar} className="flex items-end gap-4 flex-wrap">
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
          <Table columnas={columnas} datos={datos} />
        </>
      )}

      {syncStatusSeleccionado && (
        <ModalDetalleSincronizacion
          syncStatus={syncStatusSeleccionado}
          onClose={() => setSyncStatusSeleccionado(null)}
        />
      )}
    </div>
  )
}

export default Facturas
