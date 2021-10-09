import firebase from '../../firebase/clientApp';
import { IGenericAPIResponse } from '../utils';

const db = firebase.firestore();

export interface ICreateCheckoutResponseData {
  sessionId: string;
}

export interface ICreateCheckoutParams {
  creator: string;
  fan: string;
  type: 'onetime' | 'subscription';
  amt: number;
  note: string;
}

export interface ICreateCheckoutRequest extends ICreateCheckoutParams {
  expiresAt: number;
  createdAt: number;
  completed: boolean;
}

export interface ICreateCheckoutResponse extends IGenericAPIResponse {
  data: null | ICreateCheckoutResponseData;
}

export default async function createCheckoutSession({
  creator,
  fan,
  type,
  amt,
  note,
}: ICreateCheckoutParams): Promise<ICreateCheckoutResponse> {
  // TODO: Should check if any active subscription exist

  // Add value to db
  try {
    const result = await db
      .collection('checkoutSessions')
      .add({
        amt,
        fan,
        creator,
        type,
        note,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        expiresAt: firebase.firestore.Timestamp.fromDate(
          new Date(new Date().getTime() + 900000)
        ),
        completed: false,
      })
      .then(() => {
        return {
          error: false,
          message: 'Checkout session added successfully',
          data: null,
        };
      })
      .catch((err) => {
        return {
          error: true,
          message: `Error occurred while trying to create checkout session: ${err.message}`,
          data: null,
        };
      });
    return result;
  } catch (error) {
    return {
      error: true,
      message: `Error occurred while trying to create checkout session ${error.message}`,
      data: null,
    };
  }
}
