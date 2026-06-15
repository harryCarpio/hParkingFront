import React, { useEffect, useState } from 'react'

export function useDiccionarioDatos(servicioOpciones, opcionesQuemadas = [], onLoadingChange) {
    const [options, setOptions] = useState(opcionesQuemadas);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!servicioOpciones) return;
        setLoading(true);
        onLoadingChange?.(true);
        servicioOpciones()
            .then((res) => {
                const data = Object.values(res.data)[0];
                setOptions(data.length > 0 ? data : opcionesQuemadas);
            })
            .catch(() => setOptions(opcionesQuemadas))
            .finally(() => {
                setLoading(false);
                onLoadingChange?.(false);
            });
    }, [servicioOpciones]);
    return { options, loading };
}