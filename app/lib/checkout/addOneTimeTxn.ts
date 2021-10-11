import firebase from '../../firebase/clientApp';
import { IGenericAPIResponse } from '../utils';

const db = firebase.firestore();

export interface IOneTimeTxnData {
  payId: string;
}

export interface IAddOneTimeTxnRequest {
  amount: number;
  fan: string;
  creator: string;
  note: string;
  txnId: string;
}

export interface IAddOneTimeTxnResponse extends IGenericAPIResponse {
  data: null | IOneTimeTxnData;
}

export default async function addOneTimeTxn({
  amount,
  fan,
  creator,
  note,
  txnId,
}: IAddOneTimeTxnRequest): Promise<IAddOneTimeTxnResponse> {
  // TODO: Validate that txn signature from solana explorer
  try {
    const fanUser = db
      .collection('userMetaData')
      .doc(fan)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.exists) {
          return null;
        }
        return { ...querySnapshot.data() };
      });

    if (!fanUser) {
      return {
        error: true,
        message: "Fan doesn't exist",
        data: null,
      };
    }

    const creatorUser = await db
      .collection('userMetaData')
      .doc(creator)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.exists) {
          return null;
        }
        return { ...querySnapshot.data() };
      });

    if (!creatorUser) {
      return {
        error: true,
        message: "Creator doesn't exist",
        data: null,
      };
    }

    const result = await db
      .collection('oneTimePayments')
      .add({
        amount,
        fan,
        creator,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        note,
        txnId,
      })
      .then((docRef) => {
        return {
          error: false,
          message: 'OneTimeTxn added successfully',
          data: {
            payId: docRef.id,
          },
        };
      })
      .catch((error) => {
        return {
          error: true,
          message: `Some error occured:  ${error.message}`,
          data: null,
        };
      });

    return result;
  } catch (error) {
    return {
      error: true,
      message: `Some error occured: ${error.message}`,
      data: null,
    };
  }
}
