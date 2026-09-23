import React, { useCallback, useEffect, useState } from 'react'
import { Car, CircleDollarSign, Clock, ParkingCircle, Receipt } from 'lucide-react'
import { temas } from '../../styles/temas'
import { getIndicadores } from '../../services/kpiService'
import Spinner from '../../components/ui/Spinner'
import TarjetaKpi from '../../components/kpis/TarjetaKpi'
import TarjetaGrafico from '../../components/kpis/TarjetaGrafico'
import MedidorEstado from '../../components/kpis/MedidorEstado'
import GraficoIngresosPorDia from '../../components/kpis/GraficoIngresosPorDia'
import GraficoBarrasCategorias from '../../components/kpis/GraficoBarrasCategorias'
import GraficoActividadPorHora from '../../components/kpis/GraficoActividadPorHora'
import FiltroRangoFechas from '../../components/kpis/FiltroRangoFechas'
import { PRESET_POR_DEFECTO, rangoDePreset } from '../../components/kpis/rangosFecha'
import {
    ETIQUETA_ESTADO_USO, formatearEntero, formatearHora, formatearMinutos, formatearMoneda,
    formatearMonedaCompacta, formatearPorcentaje, severidadPorOcupacion, severidadPorTasaExito,
} from '../../components/kpis/vizTokens'

const ETIQUETA_SEVERIDAD = {
    bueno: 'Al día',
    advertencia: 'Con retrasos',
    grave: 'Degradado',
    critico: 'Crítico',
}

const ETIQUETA_OCUPACION = {
    bueno: 'Holgado',
    advertencia: 'Concurrido',
    grave: 'Casi lleno',
    critico: 'Al tope',
}

const Indicadores = () => {
    const rangoInicial = rangoDePreset(PRESET_POR_DEFECTO.dias)
    const [presetActivo, setPresetActivo] = useState(PRESET_POR_DEFECTO.id)
    const [desde, setDesde] = useState(rangoInicial.desde)
    const [hasta, setHasta] = useState(rangoInicial.hasta)
    const [datos, setDatos] = useState(null)
    const [cargando, setCargando] = useState(false)
    const [errorMensaje, setErrorMensaje] = useState(null)

    const cargar = useCallback(async (desdeActual, hastaActual) => {
        setCargando(true)
        setErrorMensaje(null)
        try {
            const { data } = await getIndicadores(desdeActual, hastaActual)
            setDatos(data)
        } catch (error) {
            const errores = error.response?.data?.errors
            setErrorMensaje(
                errores?.length
                    ? errores.map(e => e.issue).join(', ')
                    : error.response?.data?.detail || 'No se pudieron cargar los indicadores.'
            )
            console.error(error.response?.data)
        } finally {
            setCargando(false)
        }
    }, [])

    //Traer datos al montar y cada vez que cambia el rango es justamente el caso que React
    //documenta como valido para un efecto; la regla se dispara por el setCargando(true) inicial.
    useEffect(() => {
        //eslint-disable-next-line react-hooks/set-state-in-effect
        cargar(desde, hasta)
    }, [cargar, desde, hasta])

    const handlePreset = (preset) => {
        const rango = rangoDePreset(preset.dias)
        setPresetActivo(preset.id)
        setDesde(rango.desde)
        setHasta(rango.hasta)
    }

    const handleDesde = (valor) => {
        setPresetActivo(null)
        setDesde(valor)
    }

    const handleHasta = (valor) => {
        setPresetActivo(null)
        setHasta(valor)
    }

    const resumen = datos?.resumen
    const ingresosPorParqueadero = (datos?.ingresosPorParqueadero ?? [])
        .map((fila) => ({ etiqueta: fila.etiqueta, valor: Number(fila.monto), facturas: fila.facturas }))
    const usosPorEstado = (datos?.usosPorEstado ?? [])
        .map((fila) => ({ etiqueta: ETIQUETA_ESTADO_USO[fila.etiqueta] ?? fila.etiqueta, valor: fila.cantidad }))

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h1 className={`text-md ${temas.texto.textoNegritaAzul}`}>Indicadores</h1>
                <p className="text-xs text-gray-400 mt-0.5">
                    Cortes por día y hora en horario local de Ecuador (UTC-5).
                </p>
            </div>

            {/* una sola fila de filtros, encima de todo lo que condiciona */}
            <FiltroRangoFechas
                presetActivo={presetActivo}
                desde={desde}
                hasta={hasta}
                onPreset={handlePreset}
                onDesdeChange={handleDesde}
                onHastaChange={handleHasta}
            />

            {errorMensaje && <p className={temas.texto.textoErrorFormulario}>{errorMensaje}</p>}

            {cargando && !datos && <Spinner texto="Cargando indicadores.." />}

            {datos && (
                //al recargar se conserva el render previo atenuado: sin esqueleto y sin salto de layout
                <div className={`flex flex-col gap-5 transition-opacity duration-200 ${cargando ? 'opacity-50' : 'opacity-100'}`}>

                    {/* cifra principal: la unica de la vista */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4">
                        <p className="text-xs text-gray-500">Ingresos facturados en el período</p>
                        <p className="text-5xl font-semibold text-slate-800 leading-tight mt-1">
                            {formatearMoneda(resumen?.ingresosTotales)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {formatearEntero(resumen?.facturasEmitidas)} facturas cobradas ·
                            {' '}ticket promedio {formatearMoneda(resumen?.ticketPromedio)}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                        <TarjetaKpi
                            etiqueta="Facturas emitidas"
                            valor={formatearEntero(resumen?.facturasEmitidas)}
                            icono={<Receipt size={14} />}
                        />
                        <TarjetaKpi
                            etiqueta="Ticket promedio"
                            valor={formatearMoneda(resumen?.ticketPromedio)}
                            icono={<CircleDollarSign size={14} />}
                        />
                        <TarjetaKpi
                            etiqueta="Usos registrados"
                            valor={formatearEntero(resumen?.usosRegistrados)}
                            pista={`${formatearEntero(resumen?.usosActivos)} activos ahora mismo`}
                            icono={<Car size={14} />}
                        />
                        <TarjetaKpi
                            etiqueta="Duración media"
                            valor={formatearMinutos(resumen?.duracionMediaMinutos)}
                            pista="Minutos facturados por factura"
                            icono={<Clock size={14} />}
                        />
                        <TarjetaKpi
                            etiqueta="Ocupación actual"
                            valor={formatearPorcentaje(resumen?.ocupacionActual, 0)}
                            pista="Instantánea, no depende del rango"
                            icono={<ParkingCircle size={14} />}
                        />
                    </div>

                    <TarjetaGrafico
                        titulo="Ingresos facturados por día"
                        subtitulo="Suma de los totales con impuestos de las facturas cobradas"
                        columnas={[
                            { clave: 'fecha', titulo: 'Día' },
                            { clave: 'monto', titulo: 'Ingresos', alinear: 'derecha', formato: (f) => formatearMoneda(f.monto) },
                            { clave: 'facturas', titulo: 'Facturas', alinear: 'derecha', formato: (f) => formatearEntero(f.facturas) },
                        ]}
                        filas={datos.ingresosPorDia}
                    >
                        {datos.ingresosPorDia.length === 0
                            ? <p className="text-sm text-gray-400 italic py-10 text-center">Sin facturación en el rango seleccionado</p>
                            : <GraficoIngresosPorDia puntos={datos.ingresosPorDia} />}
                    </TarjetaGrafico>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <TarjetaGrafico
                            titulo="Ingresos por parqueadero"
                            subtitulo="Ordenado de mayor a menor recaudación"
                            columnas={[
                                { clave: 'etiqueta', titulo: 'Parqueadero' },
                                { clave: 'valor', titulo: 'Ingresos', alinear: 'derecha', formato: (f) => formatearMoneda(f.valor) },
                                { clave: 'facturas', titulo: 'Facturas', alinear: 'derecha', formato: (f) => formatearEntero(f.facturas) },
                            ]}
                            filas={ingresosPorParqueadero}
                        >
                            {ingresosPorParqueadero.length === 0
                                ? <p className="text-sm text-gray-400 italic py-10 text-center">Sin datos en el rango seleccionado</p>
                                : (
                                    <GraficoBarrasCategorias
                                        datos={ingresosPorParqueadero}
                                        formatoValor={formatearMonedaCompacta}
                                        resaltarPrimera
                                        renderTooltip={(fila) => (
                                            <>
                                                <p className="text-sm font-semibold text-slate-800 tabular-nums">{formatearMoneda(fila.valor)}</p>
                                                <p className="text-gray-500 mt-0.5">{fila.etiqueta}</p>
                                                <p className="text-gray-400">{formatearEntero(fila.facturas)} facturas</p>
                                            </>
                                        )}
                                    />
                                )}
                        </TarjetaGrafico>

                        <TarjetaGrafico
                            titulo="Usos de estacionamiento por estado"
                            subtitulo="Usos cuyo ingreso ocurrió dentro del rango"
                            columnas={[
                                { clave: 'etiqueta', titulo: 'Estado' },
                                { clave: 'valor', titulo: 'Usos', alinear: 'derecha', formato: (f) => formatearEntero(f.valor) },
                            ]}
                            filas={usosPorEstado}
                        >
                            <GraficoBarrasCategorias
                                datos={usosPorEstado}
                                formatoValor={formatearEntero}
                                renderTooltip={(fila) => (
                                    <>
                                        <p className="text-sm font-semibold text-slate-800 tabular-nums">{formatearEntero(fila.valor)}</p>
                                        <p className="text-gray-500 mt-0.5">{fila.etiqueta}</p>
                                    </>
                                )}
                            />
                        </TarjetaGrafico>
                    </div>

                    <TarjetaGrafico
                        titulo="Actividad por hora del día"
                        subtitulo="Facturación acumulada de todo el rango, por hora local"
                        columnas={[
                            { clave: 'hora', titulo: 'Hora', formato: (f) => formatearHora(f.hora) },
                            { clave: 'monto', titulo: 'Ingresos', alinear: 'derecha', formato: (f) => formatearMoneda(f.monto) },
                            { clave: 'facturas', titulo: 'Facturas', alinear: 'derecha', formato: (f) => formatearEntero(f.facturas) },
                        ]}
                        filas={datos.actividadPorHora}
                    >
                        <GraficoActividadPorHora puntos={datos.actividadPorHora} />
                    </TarjetaGrafico>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <TarjetaGrafico
                            titulo="Sincronización de facturas"
                            subtitulo="Facturas del rango enviadas hacia cada sistema externo"
                            columnas={[
                                { clave: 'sistema', titulo: 'Sistema' },
                                { clave: 'sincronizadas', titulo: 'OK', alinear: 'derecha', formato: (f) => formatearEntero(f.sincronizadas) },
                                { clave: 'pendientes', titulo: 'Pendientes', alinear: 'derecha', formato: (f) => formatearEntero(f.pendientes) },
                                { clave: 'fallidas', titulo: 'Fallidas', alinear: 'derecha', formato: (f) => formatearEntero(f.fallidas) },
                                { clave: 'agotadas', titulo: 'Agotadas', alinear: 'derecha', formato: (f) => formatearEntero(f.agotadas) },
                                { clave: 'tasaExito', titulo: 'Éxito', alinear: 'derecha', formato: (f) => formatearPorcentaje(f.tasaExito) },
                            ]}
                            filas={datos.sincronizacion}
                        >
                            <div className="flex flex-col gap-4 pt-1">
                                {datos.sincronizacion.map((sistema) => {
                                    const severidad = sistema.total === 0 ? 'bueno' : severidadPorTasaExito(sistema.tasaExito)
                                    const pendientes = sistema.pendientes + sistema.fallidas + sistema.agotadas
                                    return (
                                        <MedidorEstado
                                            key={sistema.sistema}
                                            titulo={sistema.sistema}
                                            etiquetaEstado={sistema.total === 0 ? 'Sin envíos' : ETIQUETA_SEVERIDAD[severidad]}
                                            severidad={severidad}
                                            tasa={sistema.tasaExito}
                                            detalle={sistema.total === 0
                                                ? 'No hay facturas por sincronizar en este rango'
                                                : `${formatearEntero(sistema.sincronizadas)} de ${formatearEntero(sistema.total)} sincronizadas · `
                                                + `${formatearEntero(pendientes)} pendientes `
                                                + `(${formatearEntero(sistema.fallidas)} fallidas, ${formatearEntero(sistema.agotadas)} agotadas)`}
                                        />
                                    )
                                })}
                            </div>
                        </TarjetaGrafico>

                        <TarjetaGrafico
                            titulo="Ocupación actual por parqueadero"
                            subtitulo="Instantánea de capacidad; no depende del rango de fechas"
                            columnas={[
                                { clave: 'parqueadero', titulo: 'Parqueadero' },
                                { clave: 'ocupados', titulo: 'Ocupados', alinear: 'derecha', formato: (f) => formatearEntero(f.ocupados) },
                                { clave: 'capacidadTotal', titulo: 'Capacidad', alinear: 'derecha', formato: (f) => formatearEntero(f.capacidadTotal) },
                                { clave: 'tasaOcupacion', titulo: 'Ocupación', alinear: 'derecha', formato: (f) => formatearPorcentaje(f.tasaOcupacion, 0) },
                            ]}
                            filas={datos.ocupacionPorParqueadero}
                        >
                            <div className="flex flex-col gap-4 pt-1">
                                {datos.ocupacionPorParqueadero.length === 0 && (
                                    <p className="text-sm text-gray-400 italic py-6 text-center">Sin parqueaderos activos</p>
                                )}
                                {datos.ocupacionPorParqueadero.map((parqueadero) => {
                                    const severidad = severidadPorOcupacion(parqueadero.tasaOcupacion)
                                    return (
                                        <MedidorEstado
                                            key={parqueadero.parkingId}
                                            titulo={parqueadero.parqueadero}
                                            etiquetaEstado={ETIQUETA_OCUPACION[severidad]}
                                            severidad={severidad}
                                            tasa={parqueadero.tasaOcupacion}
                                            detalle={`${formatearEntero(parqueadero.ocupados)} ocupados · `
                                                + `${formatearEntero(parqueadero.disponibles)} disponibles de ${formatearEntero(parqueadero.capacidadTotal)}`}
                                        />
                                    )
                                })}
                            </div>
                        </TarjetaGrafico>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Indicadores
