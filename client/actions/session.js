import sendMessage from './messaging';

export const keepAlive = () => {
  return () => {
    return Promise.resolve()
      .then(() => sendMessage({ url: '/keepalive' }))
      .catch(err => console.error(err));
  };
};
