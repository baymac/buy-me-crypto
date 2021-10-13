import { NextApiRequest, NextApiResponse } from 'next';
import addPageInfo from '../../../lib/userSettings/addPageInfo';
import { IAddPageInfoRequest } from '../../../lib/userSettings/addPageInfo';
import { IGenericAPIResponse } from '../../../lib/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }
  const { userId } = req.body;
  const body: IAddPageInfoRequest = {
    userId,
  };
  try {
    const result: IGenericAPIResponse = await addPageInfo(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      message: 'Some error occurres' + error.message,
    } as IGenericAPIResponse);
  }
}
