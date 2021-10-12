import firebase from '../../firebase/clientApp';
import { IUser } from './getUser';
const db = firebase.firestore();

export default async function updatePageInfo(username: string) {
  return await db
    .collection('users')
    .where('username', '==', username)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.docs.length === 0) return null;
      else
        return {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        } as IUser;
    });
}
