import mongoose from 'mongoose'

export default async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect('mongodb+srv://nmultsina:qRu3IsMOklK08o4I@cluster0.k1aqg.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0')
        console.log('Successfully connected to DB.')
    } catch (error) {
        return createError({ statusCode: 500, statusMessage: 'Something went wrong.' })
    }
}