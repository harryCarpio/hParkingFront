import React from 'react'
import { Car, CarFront, Bus, Motorbike, Van, Truck, Container, Construction, Tractor } from 'lucide-react'

//icono por clase de vehículo ANT; los valores no listados (creados automáticamente en el backend) usan Car
const ICONOS_TIPO_VEHICULO_ANT = {
  'AUTOMOVIL': Car,
  'JEEP': CarFront,
  'CAMIONETA': Truck,
  'VEHICULO UTILITARIO': Van,
  'CAMION': Container,
  'VOLQUETA': Construction,
  'OMNIBUS': Bus,
  'MOTOCICLETA': Motorbike,
  'VEHICULO ESPECIAL': Tractor,
}

//icono + texto de la clase de vehículo ANT (Vehicle.antVehicleType)
const TipoVehiculoAnt = ({ tipo }) => {
  if (!tipo) return '—'
  const Icono = ICONOS_TIPO_VEHICULO_ANT[tipo] ?? Car
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap" title={tipo}>
      <Icono size={16} className="text-celestevr shrink-0" />
      {tipo}
    </span>
  )
}

export default TipoVehiculoAnt
