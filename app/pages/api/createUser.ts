import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  // if(req.method !== 'POST'){
  //   res.status(200).json({message : "only post request is allowed"})
  // }
  
  // console.log(req.body);
  console.log(req.body);
  return res
}
