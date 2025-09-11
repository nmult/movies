import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

const uri  = process.env.MONGO_URL || 'mongodb://localhost:27017'
const name = process.env.DB_NAME || 'movies'

const client = new MongoClient(uri)
await client.connect()
const db = client.db(name)

const email = 'admin@example.com'
const passwordHash = await bcrypt.hash('admin123', 10)
await db.collection('users').updateOne(
    { email },
    { $setOnInsert: { email, passwordHash, roles: ['admin'], isActive: true, createdAt: new Date(), updatedAt: new Date() } },
    { upsert: true }
)

console.log('✅ Seeded user:', email)
await client.close()
