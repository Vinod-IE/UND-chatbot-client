import React from 'react'
import { render } from 'react-dom'

import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './store'
import { QueryClientProvider, QueryClient } from 'react-query'
import { UserDetailsContextProvider } from './shared/contexts/user-context'
import { PopupCloseContextProvider } from './shared/contexts/popupclose-context'
const queryClient = new QueryClient()
render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PopupCloseContextProvider>
          <UserDetailsContextProvider>
            <App />
          </UserDetailsContextProvider>
        </PopupCloseContextProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
