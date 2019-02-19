const collectionNames = require('../../firebase/collectionNames')

const userResolvers = {
  Query: {

    me: (parent, args, { currentUser }) => {
      return currentUser
    },

    /* Retrieve all users */
    users: async (parents, args, { db }) => {
      try {
        let users = []
        const querySnapshot = await db.collection(collectionNames.users).get()

        querySnapshot.forEach((doc) => {
          users.push(doc.data())
        })
        console.log('users', users)
        return users

      } catch (e) {
        console.log('Failed to retrieve users', e)
        throw new Error(e)
      }
    },

    /* Specific user */
    user: async (parent, args, { db, admin }) => {
      const { uid } = args

      try {
        const user = await admin.auth().getUser(uid)
        console.log('user', user.toJSON())
        return user.toJSON()
      } catch (e) {
        console.log('Failed to retrieve user', uid, e)
        throw new Error(e)
      }

    }
  },

  Mutation: {

    /* SIGN IN */
    signIn: async (parent, args, { db, auth, admin }) => {
      const {
        email,
        password
      } = args

      try {
        const signIn = await auth().signInWithEmailAndPassword(email, password)

        const getClaims = await admin.firestore().collection(collectionNames.userPermissions).doc(signIn.user.uid).get()
        const claims = getClaims.data()
        console.log('userClaims', claims)

        const token = await admin.auth().createCustomToken(signIn.user.uid, claims)

        console.log('sign in token', token)

        return { token }
      } catch (e) {
        console.log('Sign in error', e)
        throw e
      }
    },

    /* SIGN UP */
    signUp: async (parent, args, { db, auth, admin, defaultUserClaims }) => {
      const {
        email,
        password,
        pwdConfirmation,
        displayName
      } = args

      if(password === pwdConfirmation){
        try {
          const userCreation = await auth().createUserWithEmailAndPassword(email, password)
          const uid = userCreation.user.uid

          /* Write user permissions, only readable/writable by admin */
          const writeUserPermissions = await admin.firestore().collection(collectionNames.userPermissions).doc(uid).set(defaultUserClaims)
          /* Write some default public data for this user, ie: everyone can read */
          const writeUserPublicData = await admin.firestore().collection(collectionNames.userPublicData).doc(uid).set({
            uid: uid
          })
          /* Write some default private data for this user, ie: only admins and the user can read/write */
          const writeUserPrivateData = await admin.firestore().collection(collectionNames.userPrivateData).doc(uid).set({
            uid: uid
          })

          const token = await admin.auth().createCustomToken(uid, defaultUserClaims)
          console.log('token', token)
          return { token }
        } catch (e){
          console.log('Failed to sign up user', args, e)
          throw e
        }

      } else {
        let error = new Error("Password and confirmation don't match")
        error.code = "signup/pwd-confirmation"
        throw error
      }
    },

    setAdmin: async (parent, args, { admin, currentUser }) => {
      const { isAdmin, userId } = args
      if(currentUser && currentUser.claims.isAdmin){
        try {
          const setAdmin = await admin.firestore().collection(collectionNames.userPermissions).doc(userId).update({
            isAdmin: isAdmin
          })
          return true
        } catch(e) {
          throw e
        }
      } else {
        throw new Error('Not authorized')
      }
    }
  }
}

module.exports = userResolvers
