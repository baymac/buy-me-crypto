import { NextApiRequest, NextApiResponse } from 'next';
import getActiveSubscriptionsTo, {
  IGetActiveSubscriptionsToRequest,
  IGetActiveSubscriptionsToResponse,
} from '../../lib/getActiveSubscriptionsTo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }
  const { userId } = req.body;
  const body: IGetActiveSubscriptionsToRequest = {
    userId,
  };
  try {
    const result: IGetActiveSubscriptionsToResponse =
      await getActiveSubscriptionsTo(body);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      data: null,
      message: 'Some error occurres' + error.message,
    } as IGetActiveSubscriptionsToResponse);
  }
}
