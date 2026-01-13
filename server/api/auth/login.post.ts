import { defineEventHandler, readBody, createError, sendError } from 'h3'
import { useSupabaseAdmin } from '~/server/utils/supabase'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body
  if (!email || !password) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Email and password required' }))
  }

  const supabase = useSupabaseAdmin()
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, password, role')
    .eq('email', email)
    .limit(1)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  const user = users?.[0]
  if (!user) {
    return sendError(event, createError({ statusCode: 401, statusMessage: 'Invalid credentials' }))
  }

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) {
    return sendError(event, createError({ statusCode: 401, statusMessage: 'Invalid credentials' }))
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  )

  return { token, user: { id: user.id, email: user.email, role: user.role } }
})