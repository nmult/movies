import { defineEventHandler, readBody, createError } from 'h3'
import { getDb } from '@/server/utils/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, username, email, password, role = 'user' } = body

  // Accept either name or username for backward compatibility
  const userName = username || name

  if (!userName || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username, email and password are required'
    })
  }

  const db = getDb()
  const usersCollection = db.collection('users')

  // Check for existing user by email or username
  const existingUser = await usersCollection.findOne({
    $or: [{ email }, { username: userName }]
  })

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User with this email or username already exists'
    })
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const newUser = {
    username: userName,
    name: userName,
    email,
    password: hashedPassword,
    role,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const result = await usersCollection.insertOne(newUser)

  // Generate JWT token
  const token = jwt.sign(
    {
      id: result.insertedId.toString(),
      email: newUser.email,
      username: newUser.username,
      role: newUser.role
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  )

  return {
    message: 'User signed up successfully',
    token,
    user: {
      id: result.insertedId.toString(),
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  }
})