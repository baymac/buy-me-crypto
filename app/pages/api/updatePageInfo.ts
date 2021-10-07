import { NextApiRequest, NextApiResponse } from 'next';
import updatePageInfo, {
  IUpdatePageInfoRequest,
} from '../../lib/updatePageInfo';

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
    const result = await updatePageInfo(reqBody);
    res.status(200).json({
      error: false,
      message: result.message,
    });
  } catch (error) {
    res.status(200).json({
      error: true,
      message: 'Some error occurres' + error.message,
    });
  }
}
