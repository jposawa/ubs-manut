import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RecoilRoot } from 'recoil'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { MantineProvider } from '@mantine/core'
import "@mantine/core/styles.css"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <MantineProvider>
          <App />
          <ToastContainer />
        </MantineProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>,
)
