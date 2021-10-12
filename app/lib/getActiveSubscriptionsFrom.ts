import firebase from '../firebase/clientApp';
import { IGenericAPIRequest, IGenericAPIResponse } from './utils';
import { populateUser } from './getActiveSubscriptionsTo';
import { ISubscription } from './creatorPage/addSubscription';

const db = firebase.firestore();

export interface IGetActiveSubscriptionsFromRequest
  extends IGenericAPIRequest {}
export interface IGetAcitveSubscriptionsFromResponse
  extends IGenericAPIResponse {
  data: Array<ISubscription> | null;
}
//function to get the active subscriptions of creator from all the fans
export default async function getOneTimeTransactionsFrom({
  userId,
}: IGetActiveSubscriptionsFromRequest): Promise<IGetAcitveSubscriptionsFromResponse> {
  try {
    const activeSubscriptions: ISubscription[] = await db
      .collection('subscriptions')
      .where('creator', '==', userId)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length === 0) return null;
        else {
          let arr: ISubscription[] = [];
          querySnapshot.forEach((doc) => {
            arr.push(doc.data() as ISubscription);
          });
          return arr;
        }
      });

    if (!activeSubscriptions) {
      return {
        error: false,
        data: null,
        message: 'no active subscriptions',
      };
    } else {
      await populateUser(activeSubscriptions, 'fan');
      return {
        error: false,
        data: activeSubscriptions,
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
