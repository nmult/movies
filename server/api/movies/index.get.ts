import { defineEventHandler,  getQuery } from 'h3';
import { getDb } from '~/server/utils/database';

export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event);
  const search = Array.isArray(queryParams.search) ? queryParams.search[0] : queryParams.search;
  const db = getDb();

  const query = search
    ? { title: { $regex: new RegExp(search, 'i') } } // case-insensitive title search
    : {};

  return db.collection('movies')
    .find(query)
    .sort({ createdAt: -1 })
    .limit(20)      // ← return only the first 20
    .toArray();
});
