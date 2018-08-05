import {FILTER_RESTAURANTS, SET_ACTIVE_ORDERLIST, UPDATE_ORDERLIST} from './actionTypes';

export const getRestaurants = (filter) => {
  return {
    type: FILTER_RESTAURANTS,
    data : filter,
  };
};

export const setActiveOrderList = (id) => {
  return {
    type: SET_ACTIVE_ORDERLIST,
    data: id,
  };
};

export const updateOrderList = (newOrderList) => {
  return {
    type: UPDATE_ORDERLIST,
    data: newOrderList,
  };
};