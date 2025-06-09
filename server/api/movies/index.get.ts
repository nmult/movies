import { defineEventHandler } from 'h3';
import { getDb } from '~/server/utils/database';

export default defineEventHandler(async () => {
  const db = getDb();
  return db.collection('movies')
    .find()
    .sort({ released: -1 })
    .limit(20)      // ← return only the first 20
    .toArray();
});
