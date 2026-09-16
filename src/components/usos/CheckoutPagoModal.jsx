import React, { useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle2, Pencil, User, X } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Spinner from '../ui/Spinner'
import { temas } from '../../styles/temas'
import {
    cancelarTransaccionAtm, checkoutAtm, cobrarAtm, crearFacturaOperador, getTiposIdentificacionSri
} from '../../services/atmService'

const CONSUMIDOR_FINAL = {
    clientIdType: '07',
    clientIdNumber: '9999999999999',
    clientName: 'CONSUMIDOR FINAL',
    billingAddress: 'S/N',
    billingPhone: '9999999999',
    billingEmail: 'consumidor@final.com',
}

const formatearFecha = (iso) => (iso ? new Date(iso).toLocaleString() : '—')
const formatearMoneda = (valor) => `$${(Number(valor) || 0).toFixed(2)}`

//suma minutos a partir de un texto libre tipo "1 hora 23 minutos" (formato que reporta el sistema externo del
//parqueadero); misma expresion regular que usa el supervisor Android para no duplicar comportamiento distinto
const calcularMinutos = (duration) => {
    if (!duration) return 60
    const regex = /(\d+)\s+(día|dia|hora|minuto)/gi
    let total = 0
    let match
    while ((match = regex.exec(duration)) !== null) {
        const valor = parseInt(match[1], 10)
        const unidad = match[2].toLowerCase()
        if (unidad.startsWith('di')) total += valor * 1440
        else if (unidad.startsWith('hor')) total += valor * 60
        else if (unidad.startsWith('min')) total += valor
    }
    return total === 0 ? 60 : total
}

//resultado (label, valor) usado en el paso "Resumen"
const FilaResumen = ({ label, valor }) => (
    <div className="flex flex-col gap-0.5 py-2 border-b border-gray-100 last:border-0">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
        <span className="text-sm font-medium text-gray-800">{valor}</span>
    </div>
)

//modal de checkout + cobro en efectivo para una placa, emulando el flujo de PaymentScreen.kt del supervisor Android:
//1) checkout ATM (consulta lo que debe la placa) 2) facturacion (consumidor final o datos del cliente)
//3) cobro en efectivo (monto recibido / vuelto)
const CheckoutPagoModal = ({ plate, onClose, onCompletado }) => {
    const [cargandoCheckout, setCargandoCheckout] = useState(true)
    const [errorCheckout, setErrorCheckout] = useState(null)
    const [checkout, setCheckout] = useState(null)

    const [paso, setPaso] = useState('SUMMARY') // SUMMARY | BILLING | PAYMENT
    const [procesando, setProcesando] = useState(false)
    const [error, setError] = useState(null)

    const [tiposIdentificacion, setTiposIdentificacion] = useState([])
    const [editandoFacturacion, setEditandoFacturacion] = useState(false)
    const [facturacion, setFacturacion] = useState(CONSUMIDOR_FINAL)

    const [montoRecibido, setMontoRecibido] = useState('')
    const [vuelto, setVuelto] = useState(0)
    const [exito, setExito] = useState(false)

    useEffect(() => {
        const cargar = async () => {
            setCargandoCheckout(true)
            setErrorCheckout(null)
            try {
                const { data } = await checkoutAtm(plate)
                setCheckout(data)
            } catch (err) {
                const errores = err.response?.data?.errors
                setErrorCheckout(errores?.length ? errores.map(e => e.issue).join(', ') : (err.response?.data?.detail || 'No se pudo consultar la placa.'))
            } finally {
                setCargandoCheckout(false)
            }
        }
        cargar()

        getTiposIdentificacionSri()
            .then(({ data }) => setTiposIdentificacion(data))
            .catch((err) => console.error(err))
    }, [plate])

    const cerrar = () => {
        if (exito) {
            onCompletado()
            return
        }
        if (checkout?.tx) {
            cancelarTransaccionAtm(checkout.tx, checkout.externalParkingId).catch((err) => console.error(err))
        }
        onClose()
    }

    const handleBack = () => {
        if (paso === 'BILLING') setPaso('SUMMARY')
        else if (paso === 'PAYMENT') setPaso('BILLING')
        else cerrar()
    }

    const handleMontoRecibidoChange = (e) => {
        const limpio = e.target.value.replace(',', '.')
        const recibido = parseFloat(limpio) || 0
        setMontoRecibido(limpio)
        setVuelto(recibido >= checkout.totalAmount ? recibido - checkout.totalAmount : -1)
    }

    const handleEditarFacturacion = () => {
        setEditandoFacturacion(true)
        setFacturacion((prev) => ({ ...prev, clientIdNumber: '', clientName: '' }))
    }

    const handleVolverConsumidorFinal = () => {
        setFacturacion(CONSUMIDOR_FINAL)
        setEditandoFacturacion(false)
    }

    const handleRegistrarFactura = async () => {
        if (!facturacion.clientIdNumber.trim() || !facturacion.clientName.trim()) {
            setError('Ingrese identificación y nombre del cliente.')
            return
        }
        setProcesando(true)
        setError(null)
        try {
            await crearFacturaOperador({
                transactionId: checkout.tx,
                clientIdType: facturacion.clientIdType,
                clientIdNumber: facturacion.clientIdNumber,
                clientName: facturacion.clientName,
                billingAddress: facturacion.billingAddress,
                billingPhone: facturacion.billingPhone,
                billingEmail: facturacion.billingEmail,
                externalParkingId: checkout.externalParkingId,
                minuteQuantity: calcularMinutos(checkout.duration),
                plate: checkout.plate,
                paymentMethodCode: '01',
            })
            setPaso('PAYMENT')
        } catch (err) {
            const errores = err.response?.data?.errors
            setError(errores?.length ? errores.map(e => e.issue).join(', ') : (err.response?.data?.detail || 'Error al registrar la factura.'))
        } finally {
            setProcesando(false)
        }
    }

    const handleFinalizarCobro = async () => {
        if (vuelto < 0) return
        setProcesando(true)
        setError(null)
        try {
            await cobrarAtm({
                idTransaction: checkout.tx,
                receivedAmount: parseFloat(montoRecibido) || 0,
                returnedAmount: vuelto,
                lines: checkout.services.map((s) => s.id),
            })
            setExito(true)
        } catch (err) {
            const errores = err.response?.data?.errors
            setError(errores?.length ? errores.map(e => e.issue).join(', ') : (err.response?.data?.detail || 'Error al registrar el pago.'))
        } finally {
            setProcesando(false)
        }
    }

    const handleBotonPrincipal = () => {
        if (paso === 'SUMMARY') setPaso('BILLING')
        else if (paso === 'BILLING') handleRegistrarFactura()
        else handleFinalizarCobro()
    }

    const esGracia = !cargandoCheckout && !errorCheckout && checkout && (!checkout.tx || !checkout.ref)
    const tituloPaso = { SUMMARY: 'Resumen', BILLING: 'Facturación', PAYMENT: 'Pago' }[paso]
    const textoBoton = { SUMMARY: 'Facturar', BILLING: 'Registrar', PAYMENT: 'Finalizar' }[paso]

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={cerrar}>
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>

                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <button onClick={handleBack} className="text-gray-400 hover:text-gray-600 transition" aria-label="Atrás">
                        <ArrowLeft size={18} />
                    </button>
                    <h2 className="text-base font-semibold text-slate-700 flex-1">
                        {exito ? 'Pago registrado' : esGracia ? 'Cobro' : tituloPaso}
                    </h2>
                    <button onClick={cerrar} className="text-gray-400 hover:text-gray-600 transition" aria-label="Cerrar">
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto flex-1">
                    {cargandoCheckout && <Spinner texto="Consultando placa..." />}

                    {!cargandoCheckout && errorCheckout && (
                        <p className={temas.texto.textoErrorFormulario}>{errorCheckout}</p>
                    )}

                    {esGracia && (
                        <p className="text-sm text-gray-600 text-center py-6">
                            No hay ningún cobro pendiente para la placa <strong>{plate}</strong>
                            {checkout.grace?.grace && ` (período de gracia: ${checkout.grace.minutes} min)`}.
                        </p>
                    )}

                    {!cargandoCheckout && !errorCheckout && !esGracia && checkout && exito && (
                        <div className="flex flex-col items-center gap-3 py-6 text-center">
                            <CheckCircle2 size={40} className="text-emerald-600" strokeWidth={1.5} />
                            <p className="text-sm text-gray-600">
                                Cobro de <strong>{formatearMoneda(checkout.totalAmount)}</strong> registrado para la placa <strong>{checkout.plate}</strong>.
                            </p>
                        </div>
                    )}

                    {!cargandoCheckout && !errorCheckout && !esGracia && checkout && !exito && paso === 'SUMMARY' && (
                        <div className="flex flex-col">
                            <FilaResumen label="Placa" valor={checkout.plate} />
                            <FilaResumen label="Parqueadero" valor={checkout.parkingName} />
                            <FilaResumen label="Entrada" valor={formatearFecha(checkout.entry)} />
                            <FilaResumen label="Tiempo total" valor={checkout.duration} />
                            <FilaResumen label="Código de transacción" valor={checkout.ref} />
                            <div className="bg-emerald-50 rounded-lg px-4 py-3 mt-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Total a pagar</p>
                                <p className="text-2xl font-bold text-emerald-700">{formatearMoneda(checkout.totalAmount)}</p>
                            </div>
                        </div>
                    )}

                    {!cargandoCheckout && !errorCheckout && !esGracia && checkout && !exito && paso === 'BILLING' && (
                        <div className="flex flex-col gap-4">
                            {!editandoFacturacion && facturacion.clientIdType === '07' ? (
                                <div className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <User size={28} className="text-gray-400" />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">Consumidor final</p>
                                            <p className="text-xs text-gray-400">ID: 9999999999999</p>
                                        </div>
                                    </div>
                                    <button onClick={handleEditarFacturacion} className="text-gray-400 hover:text-slate-700 transition" title="Editar datos">
                                        <Pencil size={16} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-600">Tipo de identificación</label>
                                        <select
                                            value={facturacion.clientIdType}
                                            onChange={(e) => setFacturacion((prev) => ({ ...prev, clientIdType: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-50
                                             focus:outline-none focus:ring-2 focus:ring-accent min-h-[42px] transition duration-200"
                                        >
                                            {tiposIdentificacion.map((tipo) => (
                                                <option key={tipo.code} value={tipo.code}>{tipo.value}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <Input label="Identificación" value={facturacion.clientIdNumber}
                                        onChange={(e) => setFacturacion((prev) => ({ ...prev, clientIdNumber: e.target.value }))} />
                                    <Input label="Nombre" value={facturacion.clientName}
                                        onChange={(e) => setFacturacion((prev) => ({ ...prev, clientName: e.target.value }))} />
                                    <Input label="Dirección" value={facturacion.billingAddress}
                                        onChange={(e) => setFacturacion((prev) => ({ ...prev, billingAddress: e.target.value }))} />
                                    <Input label="Teléfono" value={facturacion.billingPhone}
                                        onChange={(e) => setFacturacion((prev) => ({ ...prev, billingPhone: e.target.value }))} />
                                    <Input label="Correo" value={facturacion.billingEmail}
                                        onChange={(e) => setFacturacion((prev) => ({ ...prev, billingEmail: e.target.value }))} />
                                    <button onClick={handleVolverConsumidorFinal} className="self-end text-xs font-semibold text-slate-600 hover:text-slate-800 transition">
                                        Volver a consumidor final
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {!cargandoCheckout && !errorCheckout && !esGracia && checkout && !exito && paso === 'PAYMENT' && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Total a pagar</p>
                                <p className="text-2xl font-bold text-slate-700">{formatearMoneda(checkout.totalAmount)}</p>
                            </div>
                            <Input
                                label="Monto recibido"
                                value={montoRecibido}
                                onChange={handleMontoRecibidoChange}
                                inputMode="decimal"
                                placeholder="0.00"
                            />
                            <div className="bg-gray-50 rounded-lg px-4 py-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Vuelto</p>
                                <p className={`text-xl font-bold ${vuelto >= 0 ? 'text-slate-700' : 'text-red-600'}`}>
                                    {formatearMoneda(vuelto)}
                                </p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <p className={temas.texto.textoErrorFormulario}>{error}</p>
                    )}
                </div>

                {!cargandoCheckout && !errorCheckout && !esGracia && checkout && !exito && (
                    <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200 flex-shrink-0">
                        <Button texto="Cancelar" variante="secondary" tamanio="md" onClick={cerrar} disabled={procesando} />
                        <Button
                            texto={textoBoton}
                            variante="emerald"
                            tamanio="md"
                            cargando={procesando}
                            disabled={paso === 'PAYMENT' && vuelto < 0}
                            onClick={handleBotonPrincipal}
                        />
                    </div>
                )}

                {(esGracia || errorCheckout || exito) && (
                    <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200 flex-shrink-0">
                        <Button texto="Cerrar" variante="secondary" tamanio="md" onClick={cerrar} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default CheckoutPagoModal
