import firebase from '../../firebase/clientApp';
import { IGenericAPIRequest, IGenericAPIResponse } from '../utils';
import userIfExists from './userIfExists';
import { IUser } from './getUser';

const db = firebase.firestore();

export interface IAddUsernameRequest extends IGenericAPIRequest {
  username: string;
}

export default async function updatePageInfo({
  userId,
  username,
}: IAddUsernameRequest): Promise<IGenericAPIResponse> {
  try {
    const userExists: IUser = await userIfExists(username);

    if (!userExists || (userExists && userId === userExists.id)) {
      const result = await db.collection('users').doc(userId).update({
        username,
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
