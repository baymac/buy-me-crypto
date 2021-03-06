import { NextApiRequest, NextApiResponse } from 'next';
import getOneTimeTransactionsFrom, {
  IGetOneTimeTransactionsFromRequest,
} from '../../lib/getOneTimeTransactionsFrom';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }
  const { userId } = req.body;
  const body: IGetOneTimeTransactionsFromRequest = {
    userId,
  };
  try {
    const result = await getOneTimeTransactionsFrom(body);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      message: 'Some error occurres' + error.message,
    });
  }
}
