import mongoose from 'mongoose';
import { defineNitroPlugin, useRuntimeConfig } from '#imports';

export default defineNitroPlugin(async () => {
  const uri = useRuntimeConfig().apiSecret.MONGO_URL;
  if (!uri) throw new Error('Missing MONGO_URL');
  await mongoose.connect(uri);
  console.log('✅ Mongoose connected');
});
