import { NextApiRequest, NextApiResponse } from 'next';
import firebase from '../../firebase/clientApp';
// import {getDoc} from 'firebase/firestore'
import updatePageInfo from '../../lib/updatePageInfo'


export default async function updateUserInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {

    if(req.method !== 'POST'){
        res.status(200).json({message : 'Wrong req method'})
    }

    try{

        const body = {
            aboutPage : req.body.aboutPage,
            pageName  : req.body.pageName,
            pageHeadline : req.body.pageHeadline,
            Links : {
                youtube : req.body.hasOwnProperty('youtube') ? req.body.youtube  : "" ,
                instagram : req.body.hasOwnProperty('instagram')  ? req.body.instagram  : "" ,
                twitter : req.body.hasOwnProperty('twitter')  ? req.body.twitter  : "" ,
                twitch : req.body.hasOwnProperty('twitch')  ? req.body.twitch  : "" ,
                personalBlog : req.body.hasOwnProperty('personal blog')  ? req.body['personal blog']  : "" ,
            }
        }
        
        const result = await updatePageInfo(req.body.userId,body)

        res.status(200).json({
            error: false, 
            message : 'Updation successful'
        })
    }
    catch (error){
        res.status(200).json({
            error: true,
            message : 'Some error occurres' + error.message
        })
    }
}
