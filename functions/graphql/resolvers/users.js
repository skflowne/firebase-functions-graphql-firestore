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
    signUp: async (parent, args, { auth, admin }) => {
      const {
        email,
        password,
        pwdConfirmation,
        displayName
      } = args

      if(password === pwdConfirmation){
        try {
          const userCreation = await auth.createUserWithEmailAndPassword(email, password)
          const uid = userCreation.user.uid

          const token = await admin.auth().createCustomToken(uid)
          console.log('token', token)
          return { token }
        } catch (e){
          console.log('Failed to sign up user', args, e)
          throw new Error(e)
        }

      } else {
        throw new Error("Password and confirmation don't match")
      }
    }
  }
}

module.exports = userResolvers
