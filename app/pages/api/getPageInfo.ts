import { NextApiRequest, NextApiResponse } from 'next';
import getPageInfo, { IGetPageInfoRequest } from '../../lib/getPageInfo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }
  const { userId } = req.body;
  const body: IGetPageInfoRequest = {
    userId,
  };
  try {
    const result = await getPageInfo(body);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      message: 'Some error occurred' + error.message,
    });
  }
}
