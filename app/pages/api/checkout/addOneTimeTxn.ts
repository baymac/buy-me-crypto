import { NextApiRequest, NextApiResponse } from 'next';
import addOneTimeTxn from '../../../lib/checkout/addOneTimeTxn';
import {
  IAddOneTimeTxnRequest,
  IAddOneTimeTxnResponse,
} from '../../../lib/checkout/addOneTimeTxn';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { amount, fan, creator, note, txnId } = req.body;

  const body: IAddOneTimeTxnRequest = {
    amount,
    fan,
    creator,
    note,
    txnId,
  };
  try {
    const result: IAddOneTimeTxnResponse = await addOneTimeTxn(body);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({
      error: true,
      message: 'Some error occurres' + error.message,
    });
  }
}
