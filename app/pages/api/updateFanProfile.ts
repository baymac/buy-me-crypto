import { NextApiRequest, NextApiResponse } from 'next';
import updateFanProfile from '../../lib/updateFanProfile'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }
  const { userId ,username } = req.body;
  const body = {
    userId,
    username
  };
  try {
    const result = await updateFanProfile(body);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      message: 'Some error occurres' + error.message,
    });
  }
}
