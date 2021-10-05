import firebase from '../firebase/clientApp';
import { IPageInfo } from './addPageInfo';
import { IGenericAPIRequest, IGenericAPIResponse } from './utils';

const db = firebase.firestore();

export interface IUpdatePageInfoRequest extends IGenericAPIRequest {
  body: IPageInfo;
}

export default async function updatePageInfo({
  userId,
  body,
}: IUpdatePageInfoRequest): Promise<IGenericAPIResponse> {
  try {
    const userInfo = await db
      .collection('pageInfo')
      .doc(userId)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.exists) {
          return null;
        }
        return { ...querySnapshot.data() };
      });

    if (userInfo) {
      for (let x in body.links) {
        if (body.links[x] === '' && userInfo.links.hasOwnProperty(x)) {
          body.links[x] = userInfo.links[x];
        }
      }

      const result = await db
        .collection('pageInfo')
        .doc(userId)
        .update({
          ...body,
        });

      const updatedPageInfo = await db
        .collection('pageInfo')
        .doc(userId)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.exists) {
            return null;
          }
          return { ...querySnapshot.data() };
        });

      let profileCompleted: boolean = true;

      for (let x in updatedPageInfo) {
        if (!updatedPageInfo[x] || updatedPageInfo[x].length === 0) {
          profileCompleted = false;
        }
      }

      if (profileCompleted) {
        for (let x in updatedPageInfo.links) {
          if (!updatedPageInfo || updatedPageInfo.links[x].length === 0) {
            profileCompleted = false;
          }
        }
      }

      if (profileCompleted) {
        await db
          .collection('userMetaData')
          .doc(userId)
          .update({
            profileCompleted: true,
          })
          .then(() => {
            console.log('profile status changed');
          })
          .catch((error) => {
            console.log('eror' + error.message);
          });
      }

      return {
        error: false,
        message: 'Page Info updated successfully',
      };
    } else {
      return {
        error: true,
        message: 'The user is not a creator',
      };
    }
  } catch (error) {
    return {
      error: true,
      message: 'Some error occured ' + error.message,
    };
  }
}
