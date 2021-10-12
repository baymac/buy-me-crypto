import firebase from '../firebase/clientApp';
import getUserFromId from './userSettings/getUserFromId';
import { convertDate, IGenericAPIRequest } from './utils';
const db = firebase.firestore();

export interface IActiveSubscriptionsToRequest extends IGenericAPIRequest {}

export async function populateUser(activeSubs, field) {
  for (let i in activeSubs) {
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
  sortArrInDesc(activeSubs);
  for (let i in activeSubs) {
    activeSubs[i].createdAt = convertDate(activeSubs[i].createdAt);
  }
}

function sortArrInDesc(arr) {
  arr.sort((a, b) => {
    return (
      b.createdAt.seconds * 1000 +
      Math.round(b.createdAt.nanoseconds) / 1000000 -
      (a.createdAt.seconds * 1000 +
        Math.round(a.createdAt.nanoseconds) / 1000000)
    );
  });
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
        error: false,
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
