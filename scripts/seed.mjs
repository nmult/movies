// seed.mjs (ESM)
import { MongoClient } from 'mongodb';
import { EJSON } from 'bson';            // ← added
import fs from 'fs/promises';
import { join } from 'node:path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

async function seedDatabase() {
    const uri = process.env.MONGO_URL || 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('movies');
        const collection = db.collection('movies');

        const dataPath = join(process.cwd(), 'data', 'movies.json')
        const raw = await fs.readFile(dataPath, 'utf8');

        // Parse MongoDB Extended JSON -> real ObjectId/Date/etc.
        let docs = EJSON.parse(raw, { relaxed: false });
        if (!Array.isArray(docs)) docs = [docs];

        // If you want MongoDB to generate new _id values, uncomment this:
        // docs = docs.map(({ _id, ...rest }) => rest);

        const result = await collection.insertMany(docs);
        console.log(`${result.insertedCount} documents inserted.`);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exitCode = 1;
    } finally {
        await client.close();
    }
}

seedDatabase();
