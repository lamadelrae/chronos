import axios from 'axios'

import { env } from '@/env'

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'ngrok-skip-browser-warning': 4940,
  },
})

if (env.NEXT_PUBLIC_API_DELAY) {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) =>
      setTimeout(resolve, Math.round(Math.random() * 3000)),
    )
    return config
  })
}
