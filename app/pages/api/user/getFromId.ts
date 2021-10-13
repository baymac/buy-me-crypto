import { NextApiRequest, NextApiResponse } from 'next';
import { IGetUserResponse } from ',,/../../lib/userSettings/getUser';
import getUserFromId from '../../../lib/userSettings/getUserFromId';
import { IGetUserFromIdRequest } from '../../../lib/userSettings/getUserFromId';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }
  const { userId } = req.body;
  const body: IGetUserFromIdRequest = {
    userId,
  };
  try {
    const result: IGetUserResponse = await getUserFromId(body);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      data: null,
      message: 'Some error occurres' + error.message,
    } as IGetUserResponse);
  }
}
