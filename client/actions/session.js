import debounce from 'lodash/debounce';
import sendMessage from './messaging';

const debouncedSendMessage = debounce(sendMessage, 30000);

export const keepAlive = () => {
  return () => {
    return Promise.resolve()
      .then(() => debouncedSendMessage({ url: '/keepalive' }))
      .catch(err => console.error(err));
  };
};
