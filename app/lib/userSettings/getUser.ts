import firebase from '../../firebase/clientApp';
import { IGenericAPIResponse } from '../utils';
import userIfExists from './userIfExists';

const db = firebase.firestore();

export interface IGetUserRequest {
  username: string;
}

export interface IUser {
  name: string;
  email: string;
  image: string;
  username: string;
  emailVerified: string;
  id?: string;
}

export interface IGetUserResponse extends IGenericAPIResponse {
  data: IUser | null;
}

export default async function getUserInfo({
  username,
}: IGetUserRequest): Promise<IGetUserResponse> {
  try {
    const user: IUser = await userIfExists(username);
    if (user) {
      return {
        error: false,
        data: user,
        message: 'creator metaData found',
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
