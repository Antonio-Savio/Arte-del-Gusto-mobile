import axios from 'axios'

export const api = axios.create({
    baseURL: 'https://arte-del-gusto-back-end.vercel.app'
})