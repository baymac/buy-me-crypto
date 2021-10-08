import firebase from '../firebase/clientApp';
import { IGenericAPIRequest, IGenericAPIResponse } from './utils';

const db = firebase.firestore();

export interface IActiveSubscriptionsFromRequest extends IGenericAPIRequest{}

//function to get the active subscriptions of creator from all the fans
export default async function getActiveSubscriptionFrom({
    userId
}: IActiveSubscriptionsFromRequest) {
  try {
    const activeSubscriptions = await db
      .collection('subscriptions')
      .where('creator', '==', userId)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length === 0) return null;
        else{
            let arr = []
            querySnapshot.forEach((doc)=>{
                arr.push(doc.data())
            })
            return arr
        }
      });

    if (!activeSubscriptions) {
      return {
        error: true,
        data: null,
        message: 'no active subscriptions',
      };
    } else {
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
