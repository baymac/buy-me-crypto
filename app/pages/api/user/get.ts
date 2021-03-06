import { NextApiRequest, NextApiResponse } from 'next';
import getUser, {
  IGetUserResponse,
  IGetUserRequest,
} from '../../../lib/userSettings/getUser';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }
  const { username } = req.body;
  const body: IGetUserRequest = {
    username,
  };
  try {
    const result: IGetUserResponse = await getUser(body);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      data: null,
      message: 'Some error occurres' + error.message,
    } as IGetUserResponse);
  }
}
