import firebase from '../../firebase/clientApp';
import { IPageInfo } from './addPageInfo';
import addUserName, { IAddUsernameRequest } from './addUsername';
import { IGenericAPIRequest, IGenericAPIResponse } from '../utils';
import getPageInfo, { IGetPageInfoResponse } from '../home/getPageInfo';

const db = firebase.firestore();

export interface IUpdatePageInfoRequest extends IGenericAPIRequest {
  body: IPageInfo;
}

export interface IUpdatePageInfoResponse extends IGenericAPIResponse {}

export default async function updatePageInfo({
  userId,
  body,
}: IUpdatePageInfoRequest): Promise<IUpdatePageInfoResponse> {
  try {
    const updateUsernameBody: IAddUsernameRequest = {
      userId,
      username: body.pageName,
    };

    // Add page name as a username for creator
    const updateUsernameRes: IGenericAPIResponse = await addUserName(
      updateUsernameBody
    );

    // throw error if username already exists
    if (updateUsernameRes.error) {
      return {
        error: true,
        message: updateUsernameRes.message,
      };
    }

    const userInfo: IPageInfo = await db
      .collection('pageInfo')
      .doc(userId)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.exists) {
          return null;
        }
        return { ...querySnapshot.data() } as IPageInfo;
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

      //checking if pageInfo is completed
      let isProfileCompleted: boolean = true;
      let res: IGetPageInfoResponse = await getPageInfo({ userId });
      let updatedPageInfo = res.data;
      for (let x in updatedPageInfo) {
        if (
          (!updatedPageInfo[x] || updatedPageInfo[x].length === 0) &&
          typeof updatedPageInfo[x] !== 'object' &&
          updatedPageInfo[x] !== null
        ) {
          isProfileCompleted = false;
        }
      }

      await db.collection('userMetaData').doc(userId).update({
        profileCompleted: isProfileCompleted,
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
