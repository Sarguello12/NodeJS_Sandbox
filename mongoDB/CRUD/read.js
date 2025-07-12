const { MongoClient } = require('mongodb')
require('dotenv').config()

async function main() {
  const client = new MongoClient(process.env.MONGO_DATABASE_URL ?? '')
  try {
    await client.connect()
    await findItem(client, "Sam Arguello")
    // await findMultipleItems(client, 100, 5)
  } finally {
    await client.close()
  }
}

main().catch(console.error)

async function findItem (client, key) {
  const res = await client.db('sample_mflix').collection('comments').findOne({ name: key })
  if (res) {
    console.log(`Found a listing in the collection with the name '${key}' Comment: ${res.text}`);
  } else {
    console.log(`No listings found with the name '${key}'`);
  }
} 

async function findMultipleItems (client, threshold, numberOfResults) {
  const res = await client.db('sample_mflix').collection('movies').find({
    runtime: { $gte: threshold }
  }).sort({ runtime: -1 }).limit(numberOfResults)

  const resArray = await res.toArray()
  if (resArray.length > 0) {
    for (const movie of resArray) {
      console.log(`${movie.title} has a runtime of ${movie.runtime} minutes`)
    }
  }
}