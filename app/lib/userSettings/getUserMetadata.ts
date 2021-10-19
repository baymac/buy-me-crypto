import firebase from '../../firebase/clientApp';
import { IGenericAPIRequest, IGenericAPIResponse } from '../utils';
import { IUserMetaData } from './addUserMetaData';

const db = firebase.firestore();

export interface IGetUserMetaDataRequest extends IGenericAPIRequest {}

export interface IGetUserMetaDataResponse extends IGenericAPIResponse {
  data: null | IUserMetaData;
}

//Having problem when declaring return types as Promise<IGetUserMetaDataResponse>
export default async function getUserMetaData({
  userId,
}: IGenericAPIRequest): Promise<IGetUserMetaDataResponse> {
  try {
    const metaData: IUserMetaData = await db
      .collection('userMetaData')
      .doc(userId)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.exists) {
          return null;
        }
        return { ...querySnapshot.data() } as IUserMetaData;
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
