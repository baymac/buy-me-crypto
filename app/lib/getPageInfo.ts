import firebase from '../firebase/clientApp';

const db = firebase.firestore();

export default async function getPageInfo(userId) {
  try {
    const pageInfo = await db
      .collection('pageInfo')
      .doc(userId)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.exists) {
          return null;
        }
        return { ...querySnapshot.data() };
      });

    if (pageInfo) {
      return {
        error: false,
        pageInfo: pageInfo,
        message: 'page info found',
      };
    } else {
      return {
        error: true,
        message: 'page info not found ',
      };
    }
  } catch (error) {
    return {
      error: true,
      message: ' Some error occured while fetching apge info ' + error.message,
    };
  }
}
