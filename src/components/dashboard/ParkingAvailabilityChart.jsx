import React from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const formatHour = (ts) => {
    const date = new Date(ts);
    return date.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: false });
}

const formatPercent = (value) => `${Math.round(value * 100)}%`;

const CustomTooltip = ({ active, payload, label,totalCapacity }) => {
    if (!active || !payload?.length) return null;
    const availRate = payload[0]?.value ?? 0;
  const ocupRate = payload[1]?.value ?? 0;
  const availSpaces = Math.round(availRate * totalCapacity);
  const ocupSpaces = Math.round(ocupRate * totalCapacity);
    return (
        <div className="bg-white border border-gray-200 rounded p-2 text-sm shadow">
            <p className="font-semibold mb-1">{formatHour(label)}</p>
            <p>Disponible: <span className="text-celestevr font-bold">{formatPercent(availRate)}</span> <span className="text-gray-700 font-semibold">({availSpaces} espacios)</span></p>
            <p>Ocupado: <span className="text-red-400 font-bold">{formatPercent(ocupRate)}</span> <span className="text-gray-700 font-semibold">({ocupSpaces} espacios)</span></p>
        </div>
    );
};


const ParkingAvailabilityChart = ({ parkingName, totalCapacity, points }) => {
    return (
        <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700 text-sm">{parkingName}</h3>
                <span className="text-xs text-gray-700 font-semibold">Capacidad: {totalCapacity} espacios</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={points} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id={`gradDisp-${parkingName}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="rgb(32, 114, 185)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="rgb(32, 114, 185)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id={`gradOcup-${parkingName}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f87171" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="bucketStartTs"
                        type="number"
                        scale="time"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={formatHour}
                        tick={{ fontSize: 11 }}
                        tickCount={6}
                    />
                    <YAxis
                        tickFormatter={formatPercent}
                        domain={[0, 1]}
                        tick={{ fontSize: 11 }}
                        width={40}
                    />
                    <Tooltip content={<CustomTooltip totalCapacity={totalCapacity}/>} />
                    <Area
                        type="monotone"
                        dataKey="availabilityRate"
                        name="Disponibilidad"
                        stroke="rgb(32, 114, 185)"
                        strokeWidth={2}
                        fill={`url(#gradDisp-${parkingName})`}
                        fillOpacity={0.15}
                    />
                    <Area
                        type="monotone"
                        dataKey="occupancyRate"
                        name="Ocupación"
                        stroke="#f87171"
                        strokeWidth={2}
                        fill={`url(#gradOcup-${parkingName})`}
                        fillOpacity={0.15}
                    />
                </AreaChart>

            </ResponsiveContainer>

        </div>
    )
}

export default ParkingAvailabilityChart