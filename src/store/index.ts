// base
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import {
  createStateSyncMiddleware,
  initMessageListener,
} from 'redux-state-sync'
// reducers
import settings from './settings/reducer'
import master from './master/reducer'

const store = configureStore({
  reducer: {
    master,
    settings
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true, serializableCheck: false }).concat(createStateSyncMiddleware({})),
  preloadedState: {}
})

setupListeners(store.dispatch)
initMessageListener(store)
export default store

// Infer the `AppState` and `AppDispatch` types from the store itself
export type AppState = ReturnType<typeof store.getState>
// Inferred type: {}
export type AppDispatch = typeof store.dispatch
