const MongoClient = require('mongodb').MongoClient
const orderCache = require('./orderCache')

// since we only use 1 collection
const collection = MongoClient.connect('mongodb://localhost:27017').then(client => {
  return client.db('hk01').collection('payment')
})

async function insertOne(record) {
  return (await collection).insertOne(record)
}

async function findByRefCode(refCode) {
  const cache = await orderCache.get(refCode)
  if (cache) return cache
  const dbRecord = await (await collection).findOne({'paymentRefCode': refCode})
  if (dbRecord) {
    orderCache.setex(refCode, dbRecord)
  }
  return dbRecord
}

module.exports = {
  insertOne,
  findByRefCode,
}
