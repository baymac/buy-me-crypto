import firebase from '../firebase/clientApp';

const db = firebase.firestore();

export default async function updatePageInfo(username: string) {
  const userExists = await db
    .collection('users')
    .where('username', '==', username)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.docs.length === 0) return null;
      else
        return {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        };
    });

  return userExists;
}
