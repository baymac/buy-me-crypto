import firebase from '../firebase/clientApp';
import { IGenericAPIRequest, IGenericAPIResponse } from './utils';
const db = firebase.firestore();

export interface IAddPageInfoRequest extends IGenericAPIRequest {}

export interface IPageInfo {
  pageName: string;
  aboutPage: string;
  pageHeadline: string;
  links: {
    youtube: string;
    instagram: string;
    twitter: string;
    twitch: string;
    personalBlog: string;
  };
  solanaAddress: string;
}

export interface IAddPageInfoResponse extends IGenericAPIResponse {
  data: null | IPageInfo;
}

export default async function addPageInfo({
  userId,
}: IAddPageInfoRequest): Promise<IAddPageInfoResponse> {
  try {
    const pageInfo = await db
      .collection('pageInfo')
      .doc(userId)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.exists) {
          return null;
        }
        return { ...querySnapshot.data() };
      });

    if (!pageInfo) {
      const result = await db
        .collection('pageInfo')
        .doc(userId)
        .set({
          pageName: '',
          aboutPage: '',
          pageHeadline: '',
          links: {
            youtube: '',
            instagram: '',
            twitter: '',
            twitch: '',
            personalBlog: '',
          },
          solanaAddress: '',
        });

      console.log(result);

      return {
        error: false,
        message: 'PageInfo Created Successfully',
        data: null,
      };
    } else {
      return {
        error: true,
        message: 'page info already exits',
        data: null,
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
