import firebase from '../../firebase/clientApp';
import { IGenericAPIRequest, IGenericAPIResponse } from '../utils';
import { IUser } from './getUser';
import userIfExists from './userIfExists';

const db = firebase.firestore();

export interface IUpdateFanProfileRequest extends IGenericAPIRequest {
  username: string;
}

export default async function updateFanProfile({
  userId,
  username,
}): Promise<IGenericAPIResponse> {
  try {
    const userExists: IUser = await userIfExists(username);

    if (!userExists || (userExists && userId === userExists.id)) {
      const result = await db.collection('users').doc(userId).update({
        username,
      });

      const updateUserMetaData = await db
        .collection('userMetaData')
        .doc(userId)
        .update({
          profileCompleted: true,
        });

      return {
        error: false,
        message: 'Username updated successfully',
      };
    } else {
      return {
        error: true,
        message: 'Username taken',
      };
    }
  } catch (error) {
    return {
      error: true,
      message: 'Some error occured ' + error.message,
    };
  }
}
