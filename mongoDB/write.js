const { MongoClient } = require('mongodb')
require('dotenv').config()

async function main() {
  const client = new MongoClient(process.env.MONGO_DATABASE_URL ?? '')
  try {
    await client.connect()
    await addItem(client, {
      name: 'Sam Arguello',
      email: 'email@email.com',
      movie_id: '573a1391f29313caabcd8268',
      text: 'This is a comment',
      date: new Date()
    })
  } finally {
    await client.close()
  }
}

async function addItem (client, newItem) {
  const res = await client.db('sample_mflix').collection('comments').insertOne(newItem)
  console.log(`A document was inserted with the _id: ${res.insertedId}`)
}

main().catch(console.error)