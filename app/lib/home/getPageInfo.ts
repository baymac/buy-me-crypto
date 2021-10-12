import firebase from '../../firebase/clientApp';
import { IAddPageInfoRequest, IPageInfo } from '../userSettings/addPageInfo';
import { IGenericAPIResponse } from '../utils';
const db = firebase.firestore();

export interface IGetPageInfoRequest extends IAddPageInfoRequest {}
export interface IGetPageInfoResponse extends IGenericAPIResponse {
  data: null | IPageInfo;
}

//having problem when defining return type as IGetPageInfoResponse

export default async function getPageInfo({
  userId,
}: IGetPageInfoRequest): Promise<IGetPageInfoResponse> {
  try {
    const pageInfo = await db
      .collection('pageInfo')
      .doc(userId)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.exists) {
          return null;
        }
        return { ...querySnapshot.data() } as IPageInfo;
      });

    if (pageInfo) {
      return {
        error: false,
        data: pageInfo,
        message: 'page info found',
      };
    } else {
      return {
        error: true,
        message: 'page info not found ',
        data: null,
      };
    }
  } catch (error) {
    return {
      error: true,
      message: ' Some error occured while fetching apge info ' + error.message,
      data: null,
    };
  }
}
