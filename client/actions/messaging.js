import fetch from 'r2';

export default ({ method, data, url }) => {
  const params = {
    method,
    credentials: 'include',
    // prevent auto-redirecting request
    // to keycloak if users session expires
    redirect: 'manual',
    json: data,
  };
  return Promise.resolve()
    .then(() => fetch(url, params).response)
    .then(response => {
      // detect if redirect was attempted
      if (response.type === 'opaqueredirect') {
        window.onbeforeunload = null;
        window.location.reload();
      }
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
