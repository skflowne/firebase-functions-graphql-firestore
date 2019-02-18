require('dotenv/config')

const firebase = require('firebase')
const admin = require('firebase-admin')
require('firebase/firestore')

const config = require('./config')
const adminConfig = require('./adminConfig')

console.log('Config', config)
console.log('Admin Config', adminConfig)

console.log('Credentials path', process.env.GOOGLE_APPLICATION_CREDENTIALS)

admin.initializeApp(adminConfig)
firebase.initializeApp(config)

const db = firebase.firestore()
const auth = firebase.auth

module.exports = {
  auth,
  db,
  admin
}
