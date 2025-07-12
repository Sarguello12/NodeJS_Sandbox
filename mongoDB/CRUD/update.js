const { MongoClient } = require('mongodb')
require('dotenv').config()

async function main () {
  const client = new MongoClient(process.env.MONGO_DATABASE_URL ?? '')
  try {
    await client.connect()
    await updateItem(client, 'Sam Arguello', { text: 'I have changed my mind this movie is amazing' })
    await upsertItem(client, 'Beans', {
      name: 'Beans',
      email: 'email@email.com',
      password: 'password'
    })
    await updateMultipleItems(client)
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }
}
main().catch(console.error)

async function updateItem (client, key, updatedItem) {
  const res = await client.db('sample_mflix').collection('comments').updateOne({ name: key }, {
    $set: updatedItem
  })
  if (res.modifiedCount > 0) {
    console.log(`Updated a listing in the collection with the name '${key}'`)
  }
}

// upsert adds item if it doesn't exist
async function upsertItem (client, key, upsertedItem) {
  const res = await client.db('sample_mflix').collection('users').updateOne({ name: key }, {
    $set: upsertedItem
  }, { upsert: true })
  if (res.upsertedCount > 0) {
    console.log(`One document was inserted with the id ${res.upsertedId._id}`);
  } else {
    console.log(`${res.modifiedCount} document(s) was/were updated.`);
  }
}

async function updateMultipleItems (client) {
  const res = await client.db('sample_mflix').collection('movies').updateMany(
    { runtime: { $gte: 100 } },
    { $set: { type: 'long movie'}}
  )
  if (res.modifiedCount > 0) {
    console.log(`${res.modifiedCount} document(s) was/were updated.`);
  }
}