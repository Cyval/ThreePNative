import {GET_RESTAURANTS} from '../actions/actionTypes';

const initalState = {
  restaurants: {
    'angeles': ['Jollibee', 'Athenas', 'Marcelos'],
  }
};

const restaurants = (state = initalState, action) => {
  switch (action.type){
    default :
      return state;
  }
};

export default restaurants;