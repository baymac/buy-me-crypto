import { NextApiRequest, NextApiResponse } from 'next';
import addOneTimeTxn from '../../../lib/checkout/addOneTimeTxn';
import {
  IAddOneTimeTxnRequest,
  IAddOneTimeTxnResponse,
} from '../../../lib/checkout/addOneTimeTxn';
import markCheckoutComplete from '../../../lib/checkout/markCheckoutComplete';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { amount, fan, creator, note, txnId, payId } = req.body;

  const body: IAddOneTimeTxnRequest = {
    amount,
    fan,
    creator,
    note,
    txnId,
  };
  try {
    const result: IAddOneTimeTxnResponse = await addOneTimeTxn(body);
    if (!result.error) {
      var markCheckoutCompleteResp = await markCheckoutComplete({ payId });
    }
    if (!markCheckoutCompleteResp.error) {
      res.status(200).json(result);
    } else {
      res.status(200).json(markCheckoutCompleteResp);
    }
  } catch (error) {
    res.status(200).json({
      error: true,
      message: 'Some error occurres' + error.message,
    });
  }
}
