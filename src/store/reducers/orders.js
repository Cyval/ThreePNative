import {SET_ACTIVE_ORDERLIST,UPDATE_ORDERLIST} from '../actions/actionTypes';

export function activeOrderList(state = null, action) {
  switch (action.type) {
    case "SET_ACTIVE_ORDERLIST" :
      return action.data;
      break;
    default :
      return state;
  }
}

export function orderList(state = {}, action) {
  switch (action.type) {
    case "UPDATE_ORDERLIST" :
      let stateClone = Object.assign({},state);
      const {id,info} = action.data;
      const {name} = info;
      let menuItem = (stateClone[id] && stateClone[id].menus)
        ? stateClone[id].menus
        : {};
      menuItem[name] = info;
      stateClone[id] = {};
      stateClone[id].menus = menuItem;
      return stateClone;
      break;
    default :
      return state;
  }
}