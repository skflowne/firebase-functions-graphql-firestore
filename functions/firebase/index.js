const firebase = require('firebase')
require('firebase/firestore')

const config = require('./config')

console.log('Config', config)

firebase.initializeApp(config)

const db = firebase.firestore()

module.exports = db
