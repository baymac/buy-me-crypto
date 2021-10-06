import { NextApiRequest, NextApiResponse } from 'next';
import { IAddSubcriptionRequest, IAddSubscriptionResponse } from '../../lib/addSubscription';
import addSubscription from '../../lib/addSubscription'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }
  const { rate, fan, creator, note } = req.body;
  const body :IAddSubcriptionRequest = {
    rate : rate,
    fan : fan,
    creator : creator,
    note : note,
  };
  try {
    const result: IAddSubscriptionResponse = await addSubscription(body);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      message: 'Some error occurres' + error.message,
    });
  }
}
