import firebase from '../firebase/clientApp';
import userIfExists from './userIfExists';
import { IGenericAPIRequest, IGenericAPIResponse } from './utils';

const db = firebase.firestore();


export default async function updateFanProfile({
  userId,
  username,
}) {
  try {

    const userExists = await userIfExists(username);

    if (!userExists || (userExists && (userId === userExists.id) )  ) {

      const result = await db
        .collection('users')
        .doc(userId)
        .update({
          username
        });
     
    const updateUserMetaData = await db
        .collection('userMetaData')
        .doc(userId)
        .update({
            profileCompleted : true
        })
     

      return {
        error: false,
        data : null,
        message: 'Username updated successfully',
      };
    } else {
      return {
        error: true,
        data : null,
        message: 'Username taken',
      };
    }
  } catch (error) {
    return {
      error: true,
      data : null,
      message: 'Some error occured ' + error.message,
    };
  }
}
