import {LOGIN} from './actionTypes';

export const login = (email, password) => {
  return {
    type: LOGIN,
    email: email,
    password: password,
  };
};