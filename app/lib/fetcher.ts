const fetcher = async <P, Q>(
  url: string,
  data?: P,
  method: 'POST' | 'GET' = 'POST'
): Promise<Q> => {
  try {
    const res = await fetch(url, {
      method: method,
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      ...(data && { body: JSON.stringify(data) }),
    }).then((r) => r.json());
    // if the server replies, there's always some data in json
    // if there's a network error, it will throw at the previous line
    const resJson = await res.json();

    if (res.ok) {
      return resJson;
    }

    const error = new Error(res.statusText);
    // @ts-ignore
    error.response = response;
    // @ts-ignore
    error.data = data;
    throw error;
  } catch (error) {
    if (!error.data) {
      error.data = { message: error.message };
    }
    throw error;
  }
};

export default fetcher;
