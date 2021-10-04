import firebase from '../firebase/clientApp';

const db = firebase.firestore();

export default async function addPageInfo(userId) {
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

    if (!pageInfo) {
      const result = await db
        .collection('pageInfo')
        .doc(userId)
        .set({
          pageName: '',
          aboutPage: '',
          pageHeadline: '',
          Links: {
            youtube: '',
            instagram: '',
            twitter: '',
            twitch: '',
            personalBlog: '',
          },
        });

      return {
        error: false,
        message: 'PageInfo Created Successfully',
      };
    } else {
      return {
        error: true,
        message: 'page info already exits',
      };
    }
  } catch (error) {
    return {
      error: true,
      message: ' Some error occured while fetching metaData ' + error.message,
    };
  }
}
