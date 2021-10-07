import { NextApiRequest, NextApiResponse } from 'next';
import addOneTime from '../../lib/addOneTime';
import { IAddOneTimeRequest, IAddOneTimeResponse } from '../../lib/addOneTime';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }
  const { amount, fan, creator, note } = req.body;

  const body: IAddOneTimeRequest = {
    amount: amount,
    fan: fan,
    creator: creator,
    note: note,
  };
  try {
    const result: IAddOneTimeResponse = await addOneTime(body);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      message: 'Some error occurres' + error.message,
    });
  }
}
