import mongoose from 'mongoose'

export const mongooseTransaction = async (fn) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const result = await fn(session)
    await session.commitTransaction()
    return result
  } catch (error) {
    if (session && session.abortTransaction) {
      await session.abortTransaction()
    }
    throw error
  }
}
