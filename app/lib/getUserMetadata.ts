import firebase from '../firebase/clientApp';

const db = firebase.firestore();

export default async function getUserMetaData(userId) {
  try {
    const metaData = await db
      .collection('userMetaData')
      .doc(userId)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.exists) {
          return null;
        }
        return { ...querySnapshot.data() };
      });

    if (metaData) {
      return {
        error: false,
        metaData: metaData,
        message: 'user metaData found',
      };
    } else {
      return {
        error: true,
        message: 'meta Data not found',
      };
    }
  } catch (error) {
    return {
      error: true,
      message: ' Some error occured while fetching metaData ' + error.message,
    };
  }
}
