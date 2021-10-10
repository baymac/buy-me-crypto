import firebase from '../firebase/clientApp';
import { IGenericAPIRequest, IGenericAPIResponse } from './utils';
import { populateUser } from './getActiveSubscriptionsTo';

const db = firebase.firestore();

export interface IGetOneTimeTransactionsFromRequest
  extends IGenericAPIRequest {}

//function to get the one time transactions of creator from all the fans
export default async function getOneTimeTransactionFrom({
  userId,
}: IGetOneTimeTransactionsFromRequest) {
  try {
    const oneTimePayments = await db
      .collection('oneTime')
      .where('creator', '==', userId)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length === 0) return null;
        else {
          let arr = [];
          querySnapshot.forEach((doc) => {
            arr.push(doc.data());
          });
          return arr;
        }
      });

    if (!oneTimePayments) {
      return {
        error: true,
        data: null,
        message: 'no active subscriptions',
      };
    } else {
      await populateUser(oneTimePayments, 'fan');
      return {
        error: false,
        data: oneTimePayments,
        message: 'active subscriptions found',
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
