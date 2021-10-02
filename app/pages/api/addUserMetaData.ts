import { NextApiRequest, NextApiResponse } from 'next';
import addUserMetaData from '../../lib/addUserMetaData'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    if(req.method !== 'POST'){
        res.status(200).json({message : 'Wrong req method'})
    }

    try{
        console.log(req.body)
        const result = await addUserMetaData(req.body.userId, req.body.userLevel)
        res.status(200).json(result)
    }
    catch (error){
        res.status(200).json({
            error: true,
            message : 'Some error occurres' + error.message
        })
    }
}
