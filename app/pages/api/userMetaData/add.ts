import { NextApiRequest, NextApiResponse } from 'next';
import addUserMetaData, {
  IAddUserMetaDataRequest,
} from '../../../lib/userSettings/addUserMetaData';
import { IGenericAPIResponse } from '../../../lib/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }
  const { userId, userLevel } = req.body;
  const body: IAddUserMetaDataRequest = {
    userId,
    userLevel: userLevel,
  };
  try {
    const result: IGenericAPIResponse = await addUserMetaData(body);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      message: 'Some error occurres' + error.message,
    } as IGenericAPIResponse);
  }
}
