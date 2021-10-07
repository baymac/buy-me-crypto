import firebase from '../firebase/clientApp';
import userIfExists from './userIfExists';

const db = firebase.firestore();

export interface IGetUserRequest {
  username: string;
}

//Having problem when declaring return types as Promise<IGetcreatorMetaDataResponse>
export default async function getCreatorInfo({ username }: IGetUserRequest) {
  try {
    const user = await userIfExists(username);
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
