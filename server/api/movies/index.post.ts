import { defineEventHandler, readBody, createError, sendError } from 'h3';
import { getDb } from '~/server/utils/database';

export default defineEventHandler(async (event) => {
  // Check if user is authenticated and has admin role
  if (!event.context.auth || event.context.auth.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Admin access required'
    })
  }

  const body = await readBody(event);
  const { title, plot, genres, runtime, cast, released, directors, writers } = body;
  if (!title || !plot) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Title and plot required' }));
  }

  const db = getDb();
  const now = new Date();
  const result = await db.collection('movies').insertOne({
    title,
    plot,
    genres,
    runtime,
    cast,
    released: new Date(released),
    directors,
    writers,
    createdAt: now,
    updatedAt: now
  });

  return { id: result.insertedId };
});