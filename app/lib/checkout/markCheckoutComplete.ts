import firebase from '../../firebase/clientApp';
import { IGenericAPIResponse } from '../utils';

const db = firebase.firestore();

export interface IOneTimeTxnData {
  payId: string;
}

export interface IMarkCheckoutCompleteRequest {
  payId: string;
}

export interface IMarkCheckoutCompleteResponse extends IGenericAPIResponse {}

export default async function markCheckoutComplete({
  payId,
}: IMarkCheckoutCompleteRequest): Promise<IMarkCheckoutCompleteResponse> {
  try {
    const result = db
      .collection('checkoutSessions')
      .doc(payId)
      .update({
        completed: true,
      })
      .then(() => ({
        error: false,
        message: 'Checkout marked complete.',
        data: null,
      }))
      .catch((error) => {
        return {
          error: true,
          message: `Some error occured:  ${error.message}`,
          data: null,
        };
      });

    return result;
  } catch (error) {
    return Promise.resolve({
      error: true,
      message: `Some error occured: ${error.message}`,
      data: null,
    });
  }
}
