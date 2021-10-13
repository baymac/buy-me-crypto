import firebase from '../../firebase/clientApp';
import { populateUser } from '../getActiveSubscriptionsTo';
import { IGenericAPIResponse } from '../utils';
import { ISubscription } from './addSubscription';

const db = firebase.firestore();

export interface IActiveSubscription {
  fan: string;
  creator: string;
}
export interface IGetActiveSubscriptionRequest {
  fan: string;
  creator: string;
}

export interface IGetActiveSubscriptionResponse extends IGenericAPIResponse {
  data: ISubscription | null;
}

export default async function getActiveSubscription({
  fan,
  creator,
}: IGetActiveSubscriptionRequest): Promise<IGetActiveSubscriptionResponse> {
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
            ...querySnapshot.docs[0].data(),
          } as ISubscription;
      });

    if (!activeSubscription) {
      return {
        error: false,
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
