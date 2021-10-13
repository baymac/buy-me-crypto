import { NextApiRequest, NextApiResponse } from 'next';
import { IAddSubcriptionRequest } from '../../lib/creatorPage/addSubscription';
import addSubscription from '../../lib/creatorPage/addSubscription';
import { IGenericAPIResponse } from '../../lib/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }
  const { rate, fan, creator, note } = req.body;
  const body: IAddSubcriptionRequest = {
    rate: rate,
    fan: fan,
    creator: creator,
    note: note,
  };
  try {
    const result: IGenericAPIResponse = await addSubscription(body);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      data: null,
      message: 'Some error occurres' + error.message,
    } as IGenericAPIResponse);
  }
}
