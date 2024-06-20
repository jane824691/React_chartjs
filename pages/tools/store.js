import { createStore } from 'redux';

// 要給基礎值
const initialState = {
  user: { name: '' },
  bornCity: { city: '' },
};

// 其他要存儲的繼續+case
function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.user };
    case 'SET_BORN_CITY':
      return { ...state, bornCity: action.bornCity };

    //   defalut+state擺最後
    default:
      return state;
  }
}

const store = createStore(userReducer);

// 导出 store 和一些常用的操作
export const getCurrentUser = () => store.getState().user;
export const setUser = (user) => store.dispatch({ type: 'SET_USER', user });

export const getBornCity = () => store.getState().bornCity;
export const setBornCity = (bornCity) => store.dispatch({ type: 'SET_BORN_CITY', bornCity });

export default store;
