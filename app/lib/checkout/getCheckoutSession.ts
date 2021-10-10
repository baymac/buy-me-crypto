import firebase from '../../firebase/clientApp';
import { IGenericAPIResponse } from '../utils';
import getCreatorSolAddr from './getCreatorSolAddr';

const db = firebase.firestore();

export interface IGetCheckoutResponseData {
  creator: string;
  fan: string;
  type: 'onetime' | 'subscription';
  amt: number;
  note: string;
  expiresAt: number;
  createdAt: number;
  completed: boolean;
  creatorSolAddr: string;
}

export interface IGetCheckoutRequest {
  sessionId: string;
}

export interface IGetCheckoutResponse extends IGenericAPIResponse {
  data: null | IGetCheckoutResponseData;
}

export default async function getCheckoutSession({
  sessionId,
}: IGetCheckoutRequest): Promise<IGetCheckoutResponse> {
  try {
    const result = await db
      .collection('checkoutSessions')
      .doc(sessionId)
      .get()
      .then(async (querySnapshot) => {
        if (!querySnapshot.exists) {
          throw new Error('Checkout session not found');
        }
        const data = querySnapshot.data();
        if (data.completed) {
          throw new Error('Transaction complete');
        }
        const { seconds, nanoseconds } = data.expiresAt;
        if (
          new Date().getTime() -
            new Date(
              seconds * 1000 + Math.round(nanoseconds) / 1000000
            ).getTime() >
          0
        ) {
          throw new Error('Checkout session expired');
        }
        const creatorSolAddrResp = await getCreatorSolAddr({
          creatorId: data.creator,
        });
        if (creatorSolAddrResp.error) {
          throw new Error(creatorSolAddrResp.message);
        }
        return {
          error: false,
          message: '',
          data: {
            ...data,
            creatorSolAddr: creatorSolAddrResp.data.solanaAddress,
          },
        } as IGetCheckoutResponse;
      })
      .catch((err) => {
        return {
          error: true,
          message: `Error occurred while trying to getting checkout session: ${err.message}`,
          data: null,
        } as IGetCheckoutResponse;
      });
    return result;
  } catch (error) {
    return {
      error: true,
      message: `Error occurred while trying to create checkout session ${error.message}`,
      data: null,
    } as IGetCheckoutResponse;
  }
}
