import {createStore, applyMiddleware} from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';

const middlewares = [thunk];

export default function configureStore(initialState = {}) {
  return createStore(
    reducer,
    initialState,
    applyMiddleware(...middlewares)
  );
}
