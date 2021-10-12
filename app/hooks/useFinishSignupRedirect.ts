import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IUserMetaData } from '../lib/userSettings/addUserMetaData';
import fetchJson from '../lib/fetchJson';
import { useSnackbar } from '../context/SnackbarContextProvider';

export default function useFinishSignupRedirect() {
  const [userMetaData, setUserMetaData] = useState<IUserMetaData | null>(null);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [session, loading] = useSession();

  useEffect(() => {
    if (session) {
      const body = {
        userId: session.userId,
      };
      fetchJson('/api/getUserMetaData', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((metaData) => {
          if (!metaData.data) {
            if (localStorage.getItem('pageName')) {
              const bodyMetaData = {
                userId: session.userId,
                userLevel: 2,
              };
              const bodyPageInfo = {
                userId: session.userId,
              };

              const updatePageInfo = {
                aboutPage: '',
                pageName: localStorage.getItem('pageName'),
                pageHeadline: '',
                youtube: '',
                instagram: '',
                twitter: '',
                twitch: '',
                personalBlog: '',
                userId: session.userId,
                solanaAddress: '',
              };

              fetchJson('/api/addUserMetaData', {
                method: 'POST',
                body: JSON.stringify(bodyMetaData),
                headers: {
                  'Content-Type': 'application/json',
                },
              })
                .then((resData) => {
                  if (!resData.error) {
                    fetchJson('/api/addPageInfo', {
                      method: 'POST',
                      body: JSON.stringify(bodyPageInfo),
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    })
                      .then((pageResData) => {
                        if (pageResData.error) {
                          throw new Error(pageResData.message);
                        }
                        fetchJson('/api/updatePageInfo', {
                          method: 'POST',
                          body: JSON.stringify(updatePageInfo),
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        })
                          .then((data) => {
                            if (data.error) {
                              throw new Error(data.message);
                            }
                            fetchJson('/api/getUserMetaData', {
                              method: 'POST',
                              body: JSON.stringify(bodyPageInfo),
                              headers: {
                                'Content-Type': 'application/json',
                              },
                            })
                              .then((res) => {
                                if (res.error) {
                                  throw new Error(res.message);
                                }
                                localStorage.removeItem('pageName');
                                setUserMetaData(res.data);
                                router.push('/app');
                              })
                              .catch((err) => {
                                enqueueSnackbar({
                                  message: err.message,
                                  options: { duration: 2000 },
                                });
                              });
                          })
                          .catch((err) => {
                            enqueueSnackbar({
                              message: err.message,
                              options: { duration: 2000 },
                            });
                          });
                      })
                      .catch((err) => {
                        enqueueSnackbar({
                          message: err.message,
                          options: { duration: 2000 },
                        });
                      });
                  }
                })
                .catch((err) => {
                  enqueueSnackbar({
                    message: err.message,
                    options: { duration: 2000 },
                  });
                });
            } else {
              router.push('/finishSignup');
            }
          } else {
            setUserMetaData(metaData.data);
          }
        })
        .catch((err) => {
          enqueueSnackbar({
            message: err.message,
            options: { duration: 2000 },
          });
        });
    }
  }, [session]);

  return [userMetaData];
}
