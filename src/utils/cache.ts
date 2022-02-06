import { client } from './redis'

const cache = new Map()

const redisCache = {
  async get(key: string) {
    const value = await client.GET(key)
    if (value) {
      return JSON.parse(value) || null
    } else {
      return null
    }
  },
  async set(key: string, value: any) {
    const valueStr = value === 'string' ? value : JSON.stringify(value)
    return client.SET(key, valueStr)
  },
}

export { cache, redisCache }
