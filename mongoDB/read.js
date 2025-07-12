const { MongoClient } = require('mongodb')
require('dotenv').config()

async function main() {
  const client = new MongoClient(process.env.MONGO_DATABASE_URL ?? '')
  try {
    await client.connect()
    await findItem(client, "Sam Arguello")
  } finally {
    await client.close()
  }
}

main().catch(console.error)

async function findItem (client, key) {
  const res = await client.db('sample_mflix').collection('comments').findOne({ name: key })
  if (res) {
    console.log(`Found a listing in the collection with the name '${key}':`);
    console.log(res);
  } else {
    console.log(`No listings found with the name '${key}'`);
  }
} 