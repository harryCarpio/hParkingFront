import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Car, CircleDollarSign, Receipt, RefreshCw, Ticket } from 'lucide-react'
import { getBandChartData } from '../services/dashboardService'
import { getCapacidadParqueaderos } from '../services/parkingUsageService'
import { finDelDiaExclusivo, getIndicadores, inicioDelDia } from '../services/kpiService'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/ui/Spinner'
import { temas } from '../styles/temas'
import TarjetaKpi from '../components/kpis/TarjetaKpi'
import MedidorEstado from '../components/kpis/MedidorEstado'
import FiltroRangoFechas from '../components/kpis/FiltroRangoFechas'
import GraficoOcupacionParqueadero from '../components/dashboard/GraficoOcupacionParqueadero'
import { PRESETS, aFechaIso, rangoDePreset } from '../components/kpis/rangosFecha'
import { ZONA_OPERACION } from '../components/dashboard/tiempoLocal'
import {
  formatearEntero, formatearMoneda, severidadPorOcupacion,
} from '../components/kpis/vizTokens'

//el inicio mira el dia a dia: 30 o 90 dias de curvas por hora son trabajo de Indicadores
const PRESETS_INICIO = PRESETS.filter((preset) => preset.id === 'hoy' || preset.id === '7d')

const ETIQUETA_OCUPACION = {
  bueno: 'Holgado',
  advertencia: 'Concurrido',
  grave: 'Casi lleno',
  critico: 'Al tope',
}

//~100 puntos por curva sin importar el rango: por hora en un dia, cubos mas anchos en una semana
const minutosPorCubo = (desde, hasta) => {
  const dias = (new Date(`${hasta}T00:00:00Z`) - new Date(`${desde}T00:00:00Z`)) / 86400000 + 1
  return Math.max(60, Math.ceil((dias * 24) / 96) * 60)
}

const horaActual = () => new Date().toLocaleTimeString('es-EC', {
  hour: '2-digit', minute: '2-digit', hour12: false, timeZone: ZONA_OPERACION,
})

const fechaDeHoy = () => new Date().toLocaleDateString('es-EC', {
  weekday: 'long', day: 'numeric', month: 'long', timeZone: ZONA_OPERACION,
})

const PanelAdministracion = () => {
  const { usuario } = useAuth()
  const primerNombre = usuario?.name?.split(' ')[0]

  //"ahora": capacidad actual y cifras del dia
  const [capacidades, setCapacidades] = useState([])
  const [hoy, setHoy] = useState(null)
  const [cargandoAhora, setCargandoAhora] = useState(true)
  const [errorAhora, setErrorAhora] = useState(null)
  const [actualizadoA, setActualizadoA] = useState(null)

  //tendencia de ocupacion
  const [presetActivo, setPresetActivo] = useState('hoy')
  const [desde, setDesde] = useState(() => rangoDePreset(0).desde)
  const [hasta, setHasta] = useState(() => rangoDePreset(0).hasta)
  const [series, setSeries] = useState([])
  const [cargandoSeries, setCargandoSeries] = useState(true)
  const [errorSeries, setErrorSeries] = useState(null)
  //descarta respuestas viejas si el usuario cambia el rango antes de que llegue la anterior
  const ultimaConsultaSeries = useRef(0)

  const cargarAhora = useCallback(async () => {
    setCargandoAhora(true)
    setErrorAhora(null)
    const fechaHoy = aFechaIso(new Date())
    //las dos consultas son independientes: si falla una, la otra igual se muestra
    const [capacidad, indicadores] = await Promise.allSettled([
      getCapacidadParqueaderos(),
      getIndicadores(fechaHoy, fechaHoy),
    ])
    if (capacidad.status === 'fulfilled') {
      setCapacidades(capacidad.value.data)
    } else {
      setErrorAhora('No se pudo cargar la ocupación actual.')
      console.error(capacidad.reason?.response?.data)
    }
    if (indicadores.status === 'fulfilled') {
      setHoy(indicadores.value.data.resumen)
    } else {
      console.error(indicadores.reason?.response?.data)
    }
    setActualizadoA(horaActual())
    setCargandoAhora(false)
  }, [])

  const cargarSeries = useCallback(async (desdeActual, hastaActual) => {
    const consulta = ++ultimaConsultaSeries.current
    setCargandoSeries(true)
    setErrorSeries(null)
    try {
      const { data } = await getBandChartData(
        inicioDelDia(desdeActual), finDelDiaExclusivo(hastaActual), minutosPorCubo(desdeActual, hastaActual))
      if (consulta === ultimaConsultaSeries.current) setSeries(data.series)
    } catch (error) {
      if (consulta !== ultimaConsultaSeries.current) return
      const errores = error.response?.data?.errors
      setErrorSeries(errores?.length
        ? errores.map(e => e.issue).join(', ')
        : 'No se pudo cargar la ocupación del período.')
      console.error(error.response?.data)
    } finally {
      if (consulta === ultimaConsultaSeries.current) setCargandoSeries(false)
    }
  }, [])

  useEffect(() => {
    //eslint-disable-next-line react-hooks/set-state-in-effect
    cargarAhora()
  }, [cargarAhora])

  useEffect(() => {
    //eslint-disable-next-line react-hooks/set-state-in-effect
    cargarSeries(desde, hasta)
  }, [cargarSeries, desde, hasta])

  const handleActualizar = () => {
    cargarAhora()
    cargarSeries(desde, hasta)
  }

  const handlePreset = (preset) => {
    const rango = rangoDePreset(preset.dias)
    setPresetActivo(preset.id)
    setDesde(rango.desde)
    setHasta(rango.hasta)
  }

  //ocupacion actual, del mas lleno al mas holgado: lo urgente queda arriba
  const ocupacionActual = capacidades
    .map((c) => {
      const capacidad = c.totalCapacity ?? 0
      const libres = Math.min(c.availableCount ?? 0, capacidad)
      return { ...c, capacidad, libres, ocupados: capacidad - libres, tasa: capacidad > 0 ? (capacidad - libres) / capacidad : null }
    })
    .sort((a, b) => (b.tasa ?? -1) - (a.tasa ?? -1))
  const capacidadTotal = ocupacionActual.reduce((suma, c) => suma + c.capacidad, 0)
  const libresTotal = ocupacionActual.reduce((suma, c) => suma + c.libres, 0)
  const tasaGlobal = capacidadTotal > 0 ? (capacidadTotal - libresTotal) / capacidadTotal : null
  const severidadGlobal = severidadPorOcupacion(tasaGlobal)
  const multiplesDias = desde !== hasta

  return (
    <div className="flex flex-col gap-6">
      {/* saludo + estado de frescura de los datos */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-2xl ${temas.texto.textoNegritaAzul}`}>
            Bienvenido{primerNombre ? `, ${primerNombre}` : ''}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5 first-letter:uppercase">{fechaDeHoy()}</p>
        </div>
        <div className="flex items-center gap-3">
          {actualizadoA && <span className="text-xs text-gray-400">Actualizado a las {actualizadoA}</span>}
          <button
            type="button"
            onClick={handleActualizar}
            disabled={cargandoAhora}
            className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-2
              hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={14} className={cargandoAhora ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>
      </div>

      {errorAhora && <p className={temas.texto.textoErrorFormulario}>{errorAhora}</p>}

      {/* AHORA: cifra principal + cifras del dia */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col gap-3">
          <div>
            <p className="text-xs text-gray-500">Espacios libres ahora</p>
            <p className="text-5xl font-semibold text-slate-800 leading-tight mt-1">
              {cargandoAhora && capacidades.length === 0 ? '—' : formatearEntero(libresTotal)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              de {formatearEntero(capacidadTotal)} espacios en {formatearEntero(ocupacionActual.length)} parqueaderos activos
            </p>
          </div>
          <MedidorEstado
            titulo="Ocupación de la red"
            etiquetaEstado={ETIQUETA_OCUPACION[severidadGlobal]}
            severidad={severidadGlobal}
            tasa={tasaGlobal}
            detalle={`${formatearEntero(capacidadTotal - libresTotal)} vehículos ocupando espacio`}
          />
        </div>

        <div className="lg:col-span-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Hoy</h2>
            <Link to="/indicadores" className="flex items-center gap-1 text-xs text-brand hover:underline">
              Ver indicadores <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <TarjetaKpi
              etiqueta="Ingresos facturados"
              valor={formatearMoneda(hoy?.ingresosTotales)}
              pista={hoy?.ticketPromedio != null ? `Ticket promedio ${formatearMoneda(hoy.ticketPromedio)}` : 'Sin cobros todavía'}
              icono={<CircleDollarSign size={14} />}
            />
            <TarjetaKpi
              etiqueta="Facturas emitidas"
              valor={formatearEntero(hoy?.facturasEmitidas)}
              pista="Cobradas desde las 00:00"
              icono={<Receipt size={14} />}
            />
            <TarjetaKpi
              etiqueta="Vehículos dentro"
              valor={formatearEntero(hoy?.usosActivos)}
              pista="Usos activos en este momento"
              icono={<Car size={14} />}
            />
            <TarjetaKpi
              etiqueta="Ingresos de vehículos"
              valor={formatearEntero(hoy?.usosRegistrados)}
              pista="Usos que empezaron hoy"
              icono={<Ticket size={14} />}
            />
          </div>
        </div>
      </section>

      {/* ocupacion actual por parqueadero: medidores con severidad (icono + etiqueta, nunca solo color) */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">Ocupación por parqueadero</h2>
          <p className="text-xs text-gray-400 mt-0.5">Estado actual, del más lleno al más holgado</p>
        </div>
        {!cargandoAhora && ocupacionActual.length === 0 && (
          <p className="text-sm text-gray-400 italic py-6 text-center">Sin parqueaderos activos</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {ocupacionActual.map((parqueadero) => {
            const severidad = severidadPorOcupacion(parqueadero.tasa)
            return (
              <MedidorEstado
                key={parqueadero.id}
                titulo={parqueadero.name}
                etiquetaEstado={parqueadero.tasa === null ? 'Sin capacidad' : ETIQUETA_OCUPACION[severidad]}
                severidad={severidad}
                tasa={parqueadero.tasa}
                detalle={`${formatearEntero(parqueadero.libres)} libres · ${formatearEntero(parqueadero.ocupados)} ocupados`
                  + ` de ${formatearEntero(parqueadero.capacidad)}`}
              />
            )
          })}
        </div>
      </section>

      {/* tendencia: un pequenio multiplo por parqueadero, mismo eje 0-100% */}
      <section className="flex flex-col gap-3">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-700">Ocupación a lo largo del {multiplesDias ? 'período' : 'día'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Promedio por {minutosPorCubo(desde, hasta) / 60 === 1 ? 'hora' : `bloques de ${minutosPorCubo(desde, hasta) / 60} horas`},
              {' '}en hora local de Ecuador. Todas las curvas usan la misma escala para compararlas.
            </p>
          </div>
          <FiltroRangoFechas
            presets={PRESETS_INICIO}
            presetActivo={presetActivo}
            desde={desde}
            hasta={hasta}
            onPreset={handlePreset}
            onDesdeChange={(valor) => { setPresetActivo(null); setDesde(valor) }}
            onHastaChange={(valor) => { setPresetActivo(null); setHasta(valor) }}
          />
        </div>

        {errorSeries && <p className={temas.texto.textoErrorFormulario}>{errorSeries}</p>}
        {cargandoSeries && series.length === 0 && <Spinner texto="Cargando ocupación..." />}
        {!cargandoSeries && !errorSeries && series.length === 0 && (
          <p className="text-sm text-gray-400 italic py-6 text-center">No hay registros de ocupación en el rango seleccionado</p>
        )}

        {series.length > 0 && (
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 transition-opacity duration-200 ${cargandoSeries ? 'opacity-50' : 'opacity-100'}`}>
            {series.map((parqueadero) => (
              <GraficoOcupacionParqueadero
                key={parqueadero.parkingId}
                parkingName={parqueadero.parkingName}
                totalCapacity={parqueadero.totalCapacity}
                points={parqueadero.points}
                multiplesDias={multiplesDias}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default PanelAdministracion
