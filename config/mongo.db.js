const { MongoClient } = require('mongodb')
// const MongoClient = mongodb.MongoClient

// const mongoClient = mongodb.MongoClient

// create database with name 'shop'.

const mongoDbUrl =
  'mongodb+srv://fulopila9:9qVjS5mTfmDVn2G2@cluster0.9mx0z.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'

let _db

const initDb = cb => {
  if (_db) {
    console.log('Database initialized successfully.!')
    return cb(null, _db)
  }

  MongoClient.connect(mongoDbUrl)
    .then(client => {
      console.log('mongodb connected')
      _db = client.db('shop')
      cb(null, _db)
    })
    .catch(err => cb(err))
}

const getDb = () => {
  if (!_db) throw new Error('Database not initialized')

  return _db
}

module.exports = { initDb, getDb }
