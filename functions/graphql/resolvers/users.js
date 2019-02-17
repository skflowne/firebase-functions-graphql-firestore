const userResolvers = {
  Query: {
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
      }
    }
  }
}

module.exports = userResolvers
