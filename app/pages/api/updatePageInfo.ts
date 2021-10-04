import { NextApiRequest, NextApiResponse } from 'next';
import updatePageInfo from '../../lib/updatePageInfo';

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
    personalblog,
    userId,
  } = req.body;
  try {
    const body = {
      aboutPage,
      pageName,
      pageHeadline,
      links: {
        youtube: youtube ?? '',
        instagram: instagram ?? '',
        twitter: twitter ?? '',
        twitch: twitch ?? '',
        personalBlog: personalblog ?? '',
      },
    };
    const result = await updatePageInfo(userId, body);
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
