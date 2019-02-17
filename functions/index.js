

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');

const spawnServer = require('./graphql/server')
const graphqlServer = spawnServer()

exports.graphql = functions.region('europe-west1').https.onRequest(graphqlServer)
