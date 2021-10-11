import firebase from '../../firebase/clientApp';
import { IGenericAPIRequest, IGenericAPIResponse } from '../utils';
import getUserMetaData from './getUserMetadata';
const db = firebase.firestore();

export interface IAddUserMetaDataRequest extends IGenericAPIRequest {
  userLevel: number;
}

export interface IUserMetaData {
  userLevel: number;
  profileCompleted: boolean;
}

export interface IAddUserMetaDataResponse extends IGenericAPIResponse {
  data: any;
}

export default async function addUserMetaData({
  userId,
  userLevel,
}: IAddUserMetaDataRequest): Promise<IAddUserMetaDataResponse> {
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

    if (!metaData) {
      const result = await db.collection('userMetaData').doc(userId).set({
        userLevel: userLevel,
        profileCompleted: false,
      });
      const body = {
        userId: userId,
      };
      const userMetaData = await getUserMetaData(body);
      return {
        error: false,
        message: 'userMetaData Created Successfully',
        data: userMetaData.data,
      };
    } else {
      return {
        error: true,
        message: 'user Meta Data already exits',
        data: null,
      };
    }
  } catch (error) {
    return {
      error: true,
      message: ' Some error occured while fetching metaData ' + error.message,
      data: null,
    };
  }
}
