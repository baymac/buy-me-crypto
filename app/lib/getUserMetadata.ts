import firebase from '../firebase/clientApp';
import { IUserMetaData } from './addUserMetaData';
import { IGenericAPIRequest, IGenericAPIResponse } from './utils';

const db = firebase.firestore();

export interface IGetUserMetaDataRequest extends IGenericAPIRequest {}

export interface IGetUserMetaDataResponse extends IGenericAPIResponse {
  data: null | IUserMetaData;
}

//Having problem when declaring return types as Promise<IGetUserMetaDataResponse>
export default async function getUserMetaData({ userId }: IGenericAPIRequest) {
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
        data: metaData,
        message: 'user metaData found',
      };
    } else {
      return {
        error: true,
        data: null,
        message: 'meta Data not found',
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
