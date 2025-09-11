import { defineNitroPlugin, useRuntimeConfig } from '#imports'
import { MongoClient, Db } from 'mongodb'

let db: Db | null = null

export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig().apiSecret
  const uri    = config.MONGO_URL
  const name   = config.DB_NAME

  if (!uri || !name) {
    throw new Error('Missing MONGO_URL or DB_NAME in runtimeConfig.apiSecret')
  }

  const client = new MongoClient(uri)
  await client.connect()

  // **Explicitly select your DB by name**:
  db = client.db(name)
  console.log(`✅ MongoDB connected to database “${name}”`)

  // Create indexes for users collection
  await db.collection('users').createIndex({ email: 1 }, { unique: true })

  nitroApp.hooks.hook('close', async () => {
    await client.close()
    console.log('🔌 MongoDB connection closed')
  })
})

export function getDb(): Db {
  if (!db) throw new Error('Database not initialized')
  return db
}