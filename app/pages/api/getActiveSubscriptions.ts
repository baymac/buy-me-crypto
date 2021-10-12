import { NextApiRequest, NextApiResponse } from 'next';
import getActiveSubscriptions, {
  IGetActiveSubscriptionRequest,
  IGetActiveSubscriptionResponse,
} from '../../lib/creatorPage/getActiveSubscription';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }
  const { fan, creator } = req.body;
  const body: IGetActiveSubscriptionRequest = {
    fan,
    creator,
  };
  try {
    const result: IGetActiveSubscriptionResponse = await getActiveSubscriptions(
      body
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      data: null,
      message: 'Some error occurres' + error.message,
    } as IGetActiveSubscriptionResponse);
  }
}
