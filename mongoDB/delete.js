const { MongoClient } = require('mongodb')
require('dotenv').config()

async function main () {
  const client = new MongoClient(process.env.MONGO_DATABASE_URL ?? '')
  try {
    await client.connect()
    await deleteItem(client, 'Sam Arguello')
    await deleteMultiples(client, 10)
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }
}
main().catch(console.error)

async function deleteItem (client, key) {
  const res = await client.db('sample_mflix').collection('comments').deleteOne({ name: key })
  if (res.deletedCount > 0) {
    console.log(`Deleted a listing in the collection with the name '${key}'`)
  } else console.log(`No listings found with the name '${key}'`)
}

async function deleteMultiples (client, threshold) {
  const res = await client.db('sample_mflix').collection('movies').deleteMany({ runtime: { $lt: threshold }})
  if (res.deletedCount > 0) {
    console.log(`Deleted ${res.deletedCount} documents`)
  } else console.log('No documents deleted')
}