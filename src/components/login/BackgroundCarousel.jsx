import React, { useEffect, useState } from 'react'

const IMAGENES = [
    '/bg/login-bg1.jpg',
    '/bg/login-bg2.jpg',
    '/bg/login-bg3.jpg',
    '/bg/login-bg4.jpg',
    '/bg/login-bg5.jpg',
    '/bg/login-bg6.jpg',
    '/bg/login-bg7.jpg',
    '/bg/login-bg8.jpg',
    '/bg/login-bg9.jpg',
    '/bg/login-bg10.jpg',
    '/bg/login-bg11.jpg',
]

const INTERVALO_MS = 6000
const DURACION_FADE_MS = 2500

//carrusel de fondo del login: hace crossfade entre imagenes de public/bg.
//cada imagen solo se monta (y por lo tanto se descarga) la primera vez que le toca mostrarse,
//para no forzar la carga de las ~7 imagenes completas de una sola vez al entrar al login
const BackgroundCarousel = () => {
    const [indiceActual, setIndiceActual] = useState(0)
    const [imagenesActivas, setImagenesActivas] = useState(() => new Set([0]))
    const [animar] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    useEffect(() => {
        if (!animar || IMAGENES.length < 2) return

        const intervalo = setInterval(() => {
            setIndiceActual((anterior) => {
                const siguiente = (anterior + 1) % IMAGENES.length
                setImagenesActivas((activas) => new Set(activas).add(siguiente))
                return siguiente
            })
        }, INTERVALO_MS)

        return () => clearInterval(intervalo)
    }, [animar])

    return (
        <div className="absolute inset-0 bg-black">
            {IMAGENES.map((src, indice) => (
                imagenesActivas.has(indice) && (
                    <img
                        key={src}
                        src={src}
                        alt=""
                        aria-hidden="true"
                        className={`absolute inset-0 w-full h-full object-cover ease-in-out
                            ${indice === indiceActual ? "opacity-100" : "opacity-0"}`}
                        style={{ transitionProperty: "opacity", transitionDuration: `${DURACION_FADE_MS}ms` }}
                    />
                )
            ))}

            {animar && (
                <div className="absolute bottom-0 left-0 right-0 z-10 h-1 bg-white/25 overflow-hidden">
                    <div
                        key={indiceActual}
                        className="h-full bg-white animate-progreso-carrusel"
                        style={{ animationDuration: `${INTERVALO_MS}ms` }}
                    />
                </div>
            )}
        </div>
    )
}

export default BackgroundCarousel
