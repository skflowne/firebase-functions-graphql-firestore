const collectionNames = require('../../firebase/collectionNames')
const wishCollection = 'wishes'

const wishResolvers = {
    Query: {
        // GET WISHES
        wishes: async (parent, args, { admin, currentUser }) => {
            if (currentUser) {
                try {
                    const userWishesRef = await admin.firestore().collection(collectionNames.userPrivateData).doc(currentUser.uid).collection(wishCollection).get()
                    const userWishes = userWishesRef.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    console.log('user wishes', userWishes)
                    return userWishes
                } catch (e) {
                    throw e
                }
            } else {
                throw new Error('Not authorized')
            }
        },

        // GET WISH
        wish: async (parent, args, { admin, currentUser }) => {
            const {
                id
            } = args

            if (currentUser) {
                try {
                    const userWish = await admin.firestore().collection(collectionNames.userPrivateData).doc(currentUser.uid).collection(wishCollection).doc(id).get()
                    if (userWish.exists) {
                        return {
                            id: userWish.id,
                            ...userWish.data()
                        }
                    } else {
                        throw new Error('Not found')
                    }

                } catch (e) {
                    throw e
                }
            } else {
                throw new Error('Not authorized')
            }
        }
    },

    Mutation: {
        // ADD WISH
        addWish: async (parent, args, { admin, currentUser }) => {
            const {
                name,
                price
            } = args

            console.log('args', args)
            if (currentUser) {
                try {
                    const addWish = await admin.firestore().collection(collectionNames.userPrivateData).doc(currentUser.uid).collection(wishCollection).add({
                        name,
                        price
                    })
                    return addWish.id
                } catch (e) {
                    throw e
                }
            } else {
                throw new Error('Not signed in')
            }
        },

        // EDIT WISH
        editWish: async (parent, args, { admin, currentUser }) => {
            if (currentUser) {
                const {
                    id,
                    name,
                    price
                } = args

                try {
                    await admin.firestore().collection(collectionNames.userPrivateData).doc(currentUser.uid).collection(wishCollection).doc(id).update({
                        name,
                        price
                    })
                    return {
                        id,
                        name,
                        price
                    }
                } catch (e) {
                    throw e
                }
            } else {
                throw new Error('Not authorized')
            }
        },

        // REMOVE WISH
        removeWishes: async (parent, args, { admin, currentUser }) => {
            const {
                ids
            } = args

            if (currentUser) {
                try {
                    ids.map(async id => {
                        await admin.firestore().collection(collectionNames.userPrivateData).doc(currentUser.uid).collection(wishCollection).doc(id).delete()
                    })
                    return true
                } catch (e) {
                    throw e
                }
            } else {
                throw new Error('Not authorized')
            }
        }
    }
}

module.exports = wishResolvers
