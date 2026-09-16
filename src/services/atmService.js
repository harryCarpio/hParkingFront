import api from '../utils/axiosInstance';

//consulta el estado de cobro de una placa (uso activo, tarifa a pagar, referencia/tx de la transaccion ATM);
//emula POST /api/v1/atm/checkout tal como lo usa el supervisor de Android
export const checkoutAtm = (plate) => {
    return api.post('/v1/atm/checkout', { plate });
}

//cancela una transaccion de checkout ATM iniciada pero no completada (ej. el operador cierra el modal antes de pagar)
export const cancelarTransaccionAtm = (transactionId, externalParkingId) => {
    return api.post('/v1/atm/cancel', { transactionId, externalParkingId });
}

//registra la factura del operador antes de procesar el cobro (paso "Facturación" del flujo de pago)
export const crearFacturaOperador = (payload) => {
    return api.post('/v1/invoice/operator', payload);
}

//procesa el cobro en efectivo de una transaccion ATM ya facturada (paso final del flujo de pago)
export const cobrarAtm = ({ idTransaction, receivedAmount, returnedAmount, lines }) => {
    return api.post('/v1/atm/charge', { idTransaction, receivedAmount, returnedAmount, lines });
}

//tipos de identificacion SRI (tabla 6) para el select de facturacion: cedula, RUC, pasaporte, consumidor final, etc.
export const getTiposIdentificacionSri = () => {
    return api.get('/v1/sri-codes', { params: { table: 6 } });
}
