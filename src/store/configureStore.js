import {createStore, combineReducers} from 'redux';
import * as login from './reducers/login'
import * as restaurant from './reducers/restaurant';
import * as orders from './reducers/orders';

const rootReducer = combineReducers({
  ...login,
  ...restaurant,
  ...orders,
});

const configureStore = () => {
  return createStore(rootReducer);
};

export default configureStore;