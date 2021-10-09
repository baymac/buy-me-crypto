import { NextApiRequest, NextApiResponse } from 'next';
import createCheckoutSession, {
  ICreateCheckoutParams,
} from '../../../lib/creatorPage/createCheckoutSession';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { creator, fan, type, amt, note } = req.body;

  try {
    const result = await createCheckoutSession({
      creator,
      fan,
      type,
      amt,
      note,
    } as ICreateCheckoutParams);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      message: `Error ocurred ${error.message}`,
    });
  }
}
