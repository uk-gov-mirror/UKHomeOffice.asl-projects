import {createStore, applyMiddleware} from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const middlewares = [thunk, logger];

export default function configureStore() {
  return createStore(
    reducer,
    applyMiddleware(...middlewares)
  );
}
