import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLOR_DISPONIBLE = '#22c55e';
const COLOR_OCUPADO = '#f87171';

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0];
    return (
        <div className="bg-white border border-gray-200 rounded p-2 text-sm shadow">
            <p><span className="font-semibold">{name}:</span> {value} espacios</p>
        </div>
    );
};

//donut de ocupacion de un parqueadero: disponible vs ocupado, a partir de totalCapacity/availableCount
const ParkingCapacityDonut = ({ parkingName, totalCapacity, availableCount }) => {
    const sinDatos = !totalCapacity || totalCapacity <= 0;
    const ocupados = Math.max(totalCapacity - availableCount, 0);
    const data = [
        { name: 'Disponible', value: availableCount },
        { name: 'Ocupado', value: ocupados },
    ];
    const porcentajeDisponible = sinDatos ? 0 : Math.round((availableCount / totalCapacity) * 100);

    return (
        <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700 text-sm">{parkingName}</h3>
                <span className="text-xs text-gray-700 font-semibold">Capacidad: {totalCapacity ?? 0} espacios</span>
            </div>

            {sinDatos ? (
                <div className="flex items-center justify-center h-[200px] text-sm text-gray-400">
                    Sin datos de capacidad
                </div>
            ) : (
                <>
                    <div className="relative">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius="65%"
                                    outerRadius="90%"
                                    startAngle={90}
                                    endAngle={-270}
                                    stroke="#fff"
                                    strokeWidth={2}
                                >
                                    <Cell fill={COLOR_DISPONIBLE} />
                                    <Cell fill={COLOR_OCUPADO} />
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-gray-700">{porcentajeDisponible}%</span>
                            <span className="text-xs text-gray-400">disponible</span>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_DISPONIBLE }} />
                            Disponible ({availableCount})
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_OCUPADO }} />
                            Ocupado ({ocupados})
                        </span>
                    </div>
                </>
            )}
        </div>
    )
}

export default ParkingCapacityDonut
