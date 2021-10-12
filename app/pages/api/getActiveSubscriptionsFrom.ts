import { NextApiRequest, NextApiResponse } from 'next';
import getActiveSubscriptionsFrom, {
  IGetAcitveSubscriptionsFromResponse,
  IGetActiveSubscriptionsFromRequest,
} from '../../lib/getActiveSubscriptionsFrom';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }
  const { userId } = req.body;
  const body: IGetActiveSubscriptionsFromRequest = {
    userId,
  };
  try {
    const result: IGetAcitveSubscriptionsFromResponse =
      await getActiveSubscriptionsFrom(body);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      data: null,
      message: 'Some error occurres' + error.message,
    } as IGetAcitveSubscriptionsFromResponse);
  }
}
