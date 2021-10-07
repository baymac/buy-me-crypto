import firebase from '../firebase/clientApp';
import { IGenericAPIRequest, IGenericAPIResponse } from './utils';

const db = firebase.firestore();

export interface IOneTime {
  amount: number;
  fan: string;
  creator: string;
  note: string;
}
export interface IAddOneTimeRequest {
  amount: number;
  fan: string;
  creator: string;
  note: string;
}
export interface IAddOneTimeResponse extends IGenericAPIResponse {
  data: null | IOneTime;
}

export default async function addOneTime({
  amount,
  fan,
  creator,
  note,
}: IAddOneTimeRequest): Promise<IAddOneTimeResponse> {
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

    if (!fanUser || !creatorUser) {
      return {
        error: true,
        data: null,
        message: "either fan or creator doesn't exist",
      };
    } else {
      const result = await db
        .collection('oneTime')
        .add({
          amount: amount,
          fan: fan,
          creator: creator,
          start: firebase.firestore.Timestamp.fromDate(new Date()),
          active: true,
          note: note,
        })
        .then(() => {
          console.log('oneTime added successfully');
          return {
            error: false,
            message: 'oneTime added successfully',
            data: null,
          };
        })
        .catch((error) => {
          return {
            error: true,
            message: 'some error occured ' + error.message,
            data: null,
          };
        });

      return result;
    }
  } catch (error) {
    return {
      error: true,
      message: ' Some error occured while fetching metaData ' + error.message,
      data: null,
    };
  }
}
