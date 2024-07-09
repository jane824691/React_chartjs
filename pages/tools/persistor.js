import { createStore } from 'redux'
import userReducer from './store'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage/session'
// persist庫把redux store存進session
// 目前並未正式啟用 no use
const persistConfig = {
  key: 'root',
    storage,
}
const persistedReducer = persistReducer(persistConfig, userReducer)
export const store = createStore(
    persistedReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
export const persistor = persistStore(store)
