import mongoose from 'mongoose'

const DEFAULT_DB_NAME = 'lms'

const connectDb = async () => {
  const mongodbBaseUrl = (process.env.MONGODB_URL || '').replace(/\/+$/, '')
  if (!mongodbBaseUrl) {
    throw new Error('MONGODB_URL is required')
  }

  const dbName = process.env.MONGODB_DB || DEFAULT_DB_NAME
  const authSource = process.env.MONGODB_AUTH_SOURCE || 'admin'

  try {
    const connection = await mongoose.connect(`${mongodbBaseUrl}/${dbName}`, {
      authSource,
    })

    if (connection) {
      console.log('Database connected successfully')
    }

    return connection
  } catch (err) {
    console.log('Error while connecting to database', err)
    throw err
  }
}

export default connectDb
