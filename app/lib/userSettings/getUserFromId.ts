import firebase from '../../firebase/clientApp';
import { IGenericAPIRequest } from '../utils';
import { IUser, IGetUserResponse } from './getUser';
const db = firebase.firestore();

export interface IGetUserFromIdRequest extends IGenericAPIRequest {}

//Having problem when declaring return types as Promise<IGetcreatorMetaDataResponse>
export default async function getCreatorInfo({
  userId,
}: IGetUserFromIdRequest): Promise<IGetUserResponse> {
  try {
    const user = await db
      .collection('users')
      .doc(userId)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.exists) {
          return null;
        }
        return {
          id: querySnapshot.id,
          ...querySnapshot.data(),
        } as IUser;
      });

    if (user) {
      return {
        error: false,
        data: user,
        message: 'user found',
      };
    } else {
      return {
        error: true,
        data: null,
        message: 'user not found',
      };
    }
  } catch (error) {
    return {
      error: true,
      data: null,
      message: ' Some error occured while fetching metaData ' + error.message,
    };
  }
}
