import { SET_BASENAME } from './types';

export const setBasename = basename => {
  return {
    type: SET_BASENAME,
    basename
  };
};
