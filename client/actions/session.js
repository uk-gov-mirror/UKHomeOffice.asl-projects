import throttle from 'lodash/throttle';
import sendMessage from './messaging';

const debouncedSendMessage = throttle(sendMessage, 30000);

export const keepAlive = () => {
  return () => {
    return Promise.resolve()
      .then(() => debouncedSendMessage({ url: '/keepalive' }))
      .catch(err => console.error(err));
  };
};
