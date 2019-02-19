/* WARNING : If you modify these names, you need to change the security rules accordingly in firestore.rules */
const collectionNames = {
  userPermissions: 'permissions',
  userPrivateData: 'usersPrivate',
  userPublicData: 'usersPublic'
}

module.exports = collectionNames
