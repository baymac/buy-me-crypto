import firebase from '../../firebase/clientApp';
import { IPageInfo } from './addPageInfo';
import addUserName, { IAddUsernameRequest } from './addUsername';
import { IGenericAPIRequest, IGenericAPIResponse } from '../utils';
const db = firebase.firestore();

export interface IUpdatePageInfoRequest extends IGenericAPIRequest {
  body: IPageInfo;
}

export default async function updatePageInfo({
  userId,
  body,
}: IUpdatePageInfoRequest): Promise<IGenericAPIResponse> {
  try {
    const updateUsernameBody: IAddUsernameRequest = {
      userId,
      username: body.pageName,
    };

    // Add page name as a username for creator
    const updateUsernameRes = await addUserName(updateUsernameBody);

    // throw error if username already exists
    if (updateUsernameRes.error) {
      return {
        error: true,
        message: updateUsernameRes.message,
      };
    }

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
      // adding remaining social fields (that are empty or not added by user) to body to maintain schema
      for (let x in body.links) {
        if (body.links[x] === '' && userInfo.links.hasOwnProperty(x)) {
          body.links[x] = '';
        }
      }

      await db
        .collection('pageInfo')
        .doc(userId)
        .update({
          ...body,
        });

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
