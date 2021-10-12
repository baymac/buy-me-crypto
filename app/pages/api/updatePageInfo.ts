import { NextApiRequest, NextApiResponse } from 'next';
import updatePageInfo, {
  IUpdatePageInfoRequest,
  IUpdatePageInfoResponse,
} from '../../lib/userSettings/updatePageInfo';

export default async function updateUserInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'Wrong req method' });
  }
  const {
    aboutPage,
    pageName,
    pageHeadline,
    youtube,
    instagram,
    twitter,
    twitch,
    personalBlog,
    userId,
    solanaAddress,
  } = req.body;
  try {
    const reqBody: IUpdatePageInfoRequest = {
      userId,
      body: {
        aboutPage,
        pageName,
        pageHeadline,
        solanaAddress,
        links: {
          youtube: youtube ?? '',
          instagram: instagram ?? '',
          twitter: twitter ?? '',
          twitch: twitch ?? '',
          personalBlog: personalBlog ?? '',
        },
      },
    };
    const result: IUpdatePageInfoResponse = await updatePageInfo(reqBody);
    res.status(200).json({ ...result });
  } catch (error) {
    res.status(200).json({
      error: true,
      message: 'Some error occurres' + error.message,
    } as IUpdatePageInfoResponse);
  }
}
