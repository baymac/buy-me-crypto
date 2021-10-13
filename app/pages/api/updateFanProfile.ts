import { NextApiRequest, NextApiResponse } from 'next';
import updateFanProfile, {
  IUpdateFanProfileRequest,
} from '../../lib/userSettings/updateFanProfile';
import { IGenericAPIResponse } from '../../lib/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }
  const { userId, username } = req.body;
  const body: IUpdateFanProfileRequest = {
    userId,
    username,
  };
  try {
    const result: IGenericAPIResponse = await updateFanProfile(body);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      message: 'Some error occurres' + error.message,
    } as IGenericAPIResponse);
  }
}
