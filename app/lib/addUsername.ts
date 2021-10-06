import firebase from '../firebase/clientApp';
import userIfExists from './userIfExists';
import { IGenericAPIRequest, IGenericAPIResponse } from './utils';

const db = firebase.firestore();

export interface IAddUsernameRequest extends IGenericAPIRequest {
  username : string;
}

export interface IAddUsernameResponse extends IGenericAPIResponse{
    data : null 
}

export default async function updatePageInfo({
  userId,
  username,
}: IAddUsernameRequest): Promise<IAddUsernameResponse> {
  try {

    const userExists = await userIfExists(username);

    if (!userExists || (userExists && (userId === userExists.id) )  ) {

      const result = await db
        .collection('users')
        .doc(userId)
        .update({
          username
        });

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
