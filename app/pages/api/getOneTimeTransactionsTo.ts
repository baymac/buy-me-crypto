import { NextApiRequest, NextApiResponse } from 'next';
import getPastTransactionsTo,{ IGetPastTransactionsToRequest } from '../../lib/getOneTimeTransactionsTo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }
  const { userId } = req.body;
  const body: IGetPastTransactionsToRequest = {
    userId
  };
  try {
    const result = await getPastTransactionsTo(body);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      message: 'Some error occurres' + error.message,
    });
  }
}
