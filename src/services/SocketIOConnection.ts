import io from 'socket.io-client'

export const socket = io(`${import.meta.env.VITE_API_WITHOUT_API}`)
export const socketTesoreria = io(`${import.meta.env.VITE_API_WITHOUT_API_2}`)

