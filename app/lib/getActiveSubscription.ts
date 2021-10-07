import firebase from '../firebase/clientApp';
import { IGenericAPIRequest, IGenericAPIResponse } from './utils';

const db = firebase.firestore();

export interface IActiveSubscription {
  fan: string;
  creator: string;
}
export interface IGetActiveSubscriptionRequest {
  fan: string;
  creator: string;
}

export default async function getActiveSubscription({
  fan,
  creator,
}: IGetActiveSubscriptionRequest) {
  try {
    const activeSubscription = await db
      .collection('subscriptions')
      .where('fan', '==', fan)
      .where('creator', '==', creator)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length === 0) return null;
        else
          return {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
          };
      });

    if (!activeSubscription) {
      return {
        error: true,
        data: null,
        message: 'no active subscriptions',
      };
    } else {
      return {
        error: false,
        data: activeSubscription,
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
