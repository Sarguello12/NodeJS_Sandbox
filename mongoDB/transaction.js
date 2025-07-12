const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config()

async function main () {
  const client = new MongoClient(process.env.MONGO_DATABASE_URL ?? '')
  try {
    await client.connect()
    await transferBalance(client, '68729e6480e0b2cfe2feaa9d', '68729ebb80e0b2cfe2feaa9e', 100)
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }
}
main().catch(console.error)

async function transferBalance (client, from, to, amount) {
  const accounts = client.db('banking').collection('accounts')
  const session = client.startSession()

  try {
    const transactionRes = await session.withTransaction(async () => {
      if (ObjectId.isValid(from) && ObjectId.isValid(to)) {
        const subtractAccount1 = await accounts.updateOne(
          { _id: new ObjectId(from) },
          { $inc: { balance: amount * -1 } },
          { session }
        )
        if (subtractAccount1.modifiedCount !== 1) {
          await session.abortTransaction()
          return
        }

        const addAccount2 = await accounts.updateOne(
          { _id: new ObjectId(to) },
          { $inc: { balance: amount } },
          { session }
        )
        if (addAccount2.modifiedCount !== 1) {
          await session.abortTransaction()
          return
        }
        return 'Success'
      } else {
        await session.abortTransaction()
        throw new Error('Invalid ID')
      }
    })
    if (transactionRes) {
      console.log('Transaction succeeded')
    } else {
      throw new Error('Transaction failed')
    }
  } finally {
    await session.endSession()
  }
}