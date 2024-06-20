import store from '../tools/store';

const currentUser = store.getState().user;

store.dispatch({ type: 'SET_USER', user: { name: 'John Doe' } });