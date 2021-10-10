import { NextApiRequest, NextApiResponse } from 'next';
import getCheckoutSession from '../../../lib/checkout/getCheckoutSession';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { sessionId } = req.body;

  try {
    const result = await getCheckoutSession({ sessionId });
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      message: `Error ocurred: ${error.message}`,
    });
  }
}
