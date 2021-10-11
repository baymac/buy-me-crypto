import firebase from '../firebase/clientApp';
import { IGenericAPIRequest, IGenericAPIResponse } from './utils';
import { populateUser } from './getActiveSubscriptionsTo';
const db = firebase.firestore();

export interface IGetPastTransactionsToRequest extends IGenericAPIRequest {}

//function to get all the one Time transactions of a fan is currently paying
export default async function getOneTimeTransactionsTo({
  userId,
}: IGetPastTransactionsToRequest) {
  try {
    const pastTransactions = await db
      .collection('oneTimePayments')
      .where('fan', '==', userId)
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

    if (!pastTransactions) {
      return {
        error: true,
        data: null,
        message: 'No past trasactions.',
      };
    } else {
      //function populater user from user ID
      await populateUser(pastTransactions, 'creator');
      return {
        error: false,
        data: pastTransactions,
        message: '',
      };
    }
  } catch (error) {
    return {
      error: true,
      message: `Some error occured: ${error.message}`,
      data: null,
    };
  }
}
