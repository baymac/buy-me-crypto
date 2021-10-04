import { NextApiRequest, NextApiResponse } from 'next';
import firebase from '../../firebase/clientApp';
import getPageInfo from '../../lib/getPageInfo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }

  try {
    const result = await getPageInfo(req.body.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      message: 'Some error occurres' + error.message,
    });
  }
}
