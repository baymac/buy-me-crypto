import firebase from '../firebase/clientApp';
import { IGenericAPIRequest, IGenericAPIResponse } from './utils';
import getUserFromId from './getUserFromId';
const db = firebase.firestore();

export interface IActiveSubscriptionsToRequest extends IGenericAPIRequest {}

export function convertDate(start) {
  let { seconds, nanoseconds } = start;
  return (
    '' +
    new Date(
      seconds * 1000 + Math.round(nanoseconds) / 1000000
    ).toLocaleDateString()
  );
}

export async function populateUser(activeSubs, field) {
  for (let i in activeSubs) {
    activeSubs[i].start = convertDate(activeSubs[i].start);
    const body = {
      userId: activeSubs[i][field],
    };
    let { data } = await getUserFromId(body);
    if (!data) {
      throw Error('user not found');
    } else {
      activeSubs[i][field] = data.username;
    }
  }
}

//function to get all the active subscriptions a fan is currently paying
export default async function getActiveSubscriptionTo({
  userId,
}: IActiveSubscriptionsToRequest) {
  try {
    const activeSubscriptions = await db
      .collection('subscriptions')
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

    if (!activeSubscriptions) {
      return {
        error: true,
        data: null,
        message: 'no active subscriptions',
      };
    } else {
      //function populater user from user ID
      await populateUser(activeSubscriptions, 'creator');
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
