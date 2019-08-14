import fetch from 'r2';

export default ({ method, data, url }) => {
  const params = {
    method,
    credentials: 'include',
    json: data
  };
  return Promise.resolve()
    .then(() => fetch(url, params).response)
    .then(response => {
      console.log(response);
      return response.json()
        .then(json => {
          if (response.status > 399) {
            const err = new Error(json.message || `Action failed with status code: ${response.status}`);
            err.status = response.status;
            Object.assign(err, json);
            throw err;
          }
          return json;
        });
    });
};
