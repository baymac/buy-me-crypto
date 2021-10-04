import { NextApiRequest, NextApiResponse } from 'next';
import getUserMetaData from '../../lib/getUserMetadata';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }

  try {
    console.log(req.body);
    const result = await getUserMetaData(req.body.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      message: 'Some error occurres' + error.message,
    });
  }
}
