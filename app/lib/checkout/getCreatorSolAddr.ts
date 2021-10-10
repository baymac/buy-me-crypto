import firebase from '../../firebase/clientApp';
import { IGenericAPIResponse } from '../utils';

const db = firebase.firestore();

export interface IGetCreatorSolAddrResponseData {
  solanaAddress: string;
}

export interface IGetCreatorSolAddrRequest {
  creatorId: string;
}

export interface IGetCreatorSolAddrResponse extends IGenericAPIResponse {
  data: null | IGetCreatorSolAddrResponseData;
}

export default async function getCreatorSolAddr({
  creatorId,
}: IGetCreatorSolAddrRequest): Promise<IGetCreatorSolAddrResponse> {
  try {
    const result = await db
      .collection('pageInfo')
      .doc(creatorId)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.exists) {
          throw new Error('Creator page info not found');
        }
        const data = querySnapshot.data();
        return {
          error: false,
          message: '',
          data: {
            solanaAddress: data.solanaAddress,
          },
        } as IGetCreatorSolAddrResponse;
      })
      .catch((err) => {
        return {
          error: true,
          message: `Error occurred while trying to get creator sol address: ${err.message}`,
          data: null,
        } as IGetCreatorSolAddrResponse;
      });
    return result;
  } catch (error) {
    return {
      error: true,
      message: `Error occurred while trying to get creator sol address: ${error.message}`,
      data: null,
    } as IGetCreatorSolAddrResponse;
  }
}
