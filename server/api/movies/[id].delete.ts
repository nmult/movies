import { defineEventHandler, getRouterParam } from 'h3'
import { getDb } from '~/server/utils/database'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = getDb()

  const result = await db.collection('movies').deleteOne({ _id: new ObjectId(id) })

  return { deleted: result.deletedCount }
})
