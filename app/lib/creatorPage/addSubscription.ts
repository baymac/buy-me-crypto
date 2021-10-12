import firebase from '../../firebase/clientApp';
import { IUserMetaData } from '../userSettings/addUserMetaData';
import { IGenericAPIResponse } from '../utils';

const db = firebase.firestore();

export interface ISubscription {
  rate: number;
  fan: string;
  creator: string;
  note: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}
export interface IAddSubcriptionRequest {
  rate: number;
  fan: string;
  creator: string;
  note: string;
}

export default async function addSubscription({
  rate,
  fan,
  creator,
  note,
}: IAddSubcriptionRequest): Promise<IGenericAPIResponse> {
  try {
    const fanUser: IUserMetaData = await db
      .collection('userMetaData')
      .doc(fan)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.exists) {
          return null;
        }
        return { ...querySnapshot.data() } as IUserMetaData;
      });

    const creatorUser: IUserMetaData = await db
      .collection('userMetaData')
      .doc(creator)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.exists) {
          return null;
        }
        return { ...querySnapshot.data() } as IUserMetaData;
      });

    if (!fanUser || !creatorUser) {
      return {
        error: true,
        message: "either fan or creator doesn't exist",
      };
    } else {
      const result = await db
        .collection('subscriptions')
        .add({
          rate: rate,
          fan: fan,
          creator: creator,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
          active: true,
          note: note,
        })
        .then(() => {
          return {
            error: false,
            message: 'subscription added successfully',
          };
        })
        .catch((err) => {
          return {
            error: true,
            message: 'some error occured',
          };
        });

      return result;
    }
  } catch (error) {
    return {
      error: true,
      message: ' Some error occured while fetching metaData ' + error.message,
    };
  }
}
