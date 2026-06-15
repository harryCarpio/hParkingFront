import React, { useEffect, useState } from 'react'
import { getBandChartData } from '../services/dashboardService';
import Spinner from '../components/ui/Spinner';
import { temas } from '../styles/temas';
import ParkingAvailabilityChart from '../components/dashboard/ParkingAvailabilityChart';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const today = () => new Date().toISOString().split('T')[0];

const toISO = (dateStr, endOfDay = false) => {
  return endOfDay
    ? `${dateStr}T23:59:59Z`
    : `${dateStr}T00:00:00Z`;
}


const PanelAdministracion = () => {
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(today());
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = () => {
    setLoading(true);
    setError(null);
    getBandChartData(toISO(from), toISO(to, true))
      .then((res) => setSeries(res.data.series))
      .catch(() => setError('No se pudo cargar la información del dashboard.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchData();
  }, [])


  return (

    <div className=" flex flex-col gap-4">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <h1 className={`text-2xl ${temas.texto.textoNegritaAzul} `}>
          Bienvenido
        </h1>

        <div className="flex items-end gap-4 flex-wrap">
          <Input
            label="Desde"
            type="date"
            name="from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            max={to}
          />
          <Input
            label="Hasta"
            type="date"
            name="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            min={from}
            max={today()}
          />
          <Button
            texto="Consultar"
            variante="primary"
            tamanio="md"
            cargando={loading}
            onClick={fetchData}
          />
        </div>
      </div>

      {loading && <Spinner texto="Cargando dashboard..." />}
      {error && <p className={temas.texto.textoErrorFormulario}>{error}</p>}
      {!loading && !error && series.length === 0 && (
        <p className="text-gray-700 text-sm text-center">No hay datos para el rango seleccionado</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {series.map((parking) => (
            <ParkingAvailabilityChart
              key={parking.parkingId}
              parkingName={parking.parkingName}
              totalCapacity={parking.totalCapacity}
              points={parking.points}
            />
          ))}
        </div>
      )

      }


    </div>
  )
}

export default PanelAdministracion
