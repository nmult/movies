import { defineEventHandler, readBody, getRouterParam } from 'h3'
import { getDb } from '~/server/utils/database'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const db = getDb()

  const result = await db.collection('movies').updateOne(
    { _id: new ObjectId(id) },
    { $set: body }
  )

  return { modified: result.modifiedCount }
})
