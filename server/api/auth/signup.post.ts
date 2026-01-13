import { defineEventHandler, readBody, createError, sendError } from 'h3'
import { useSupabaseAdmin } from '~/server/utils/supabase'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, role = 'user' } = body

  if (!email || !password) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Email and password required' }))
  }

  const supabase = useSupabaseAdmin()
  const hashed = await bcrypt.hash(password, 10)

  // Check existing user
  const { data: existing, error: existingErr } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .limit(1)

  if (existingErr) {
    throw createError({ statusCode: 500, statusMessage: existingErr.message })
  }
  if (existing && existing.length) {
    return sendError(event, createError({ statusCode: 409, statusMessage: 'User already exists' }))
  }

  const { data: created, error } = await supabase
    .from('users')
    .insert({ email, password: hashed, role })
    .select('id, email, role')
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  const token = jwt.sign(
    { id: created.id, email: created.email, role: created.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  )

  return {
    message: 'User signed up successfully',
    token,
    user: created
  }
})