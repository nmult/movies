import { defineEventHandler, readBody, createError } from 'h3'
import { getDb } from '@/server/utils/database'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
    })
  }

  const db = getDb()
  const usersCollection = db.collection('users')

  const user = await usersCollection.findOne({ email })
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  )

  return { token, user: { email: user.email, role: user.role, name: user.name } }
})