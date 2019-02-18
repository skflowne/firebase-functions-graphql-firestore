const userResolvers = {
  Query: {

    /* Retrieve all users */
    users: async (parents, args, { db }) => {
      try {
        let users = []
        const querySnapshot = await db.collection('users').get()

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
    signIn: async (parent, args, { auth }) => {
      const {
        email,
        password
      } = args

      try {
        const signIn = await auth().signInWithEmailAndPassword(email, password)
        const user = await signIn.user.getIdTokenResult(true)

        return user
      } catch (e) {
        console.log('Sign in error', e)
        throw e
      }
    },

    /* SIGN UP */
    signUp: async (parent, args, { auth, admin }) => {
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

          const token = await admin.auth().createCustomToken(uid)
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
    }
  }
}

module.exports = userResolvers
