import './App.css'
import {RouterProvider} from 'react-router'
 import { ToastContainer } from 'react-toastify';
 // Without this stylesheet, react-toastify's container has no position:fixed
 // or z-index at all — it just sits in normal page flow, which is why
 // toasts were rendering underneath the navbar/modals/other content instead
 // of floating on top.
 import 'react-toastify/dist/ReactToastify.css';
 import {  QueryClientProvider } from '@tanstack/react-query'
import {router} from './routes'
import { queryClient } from './lib/utils';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {


  return (
    <ThemeProvider>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
       <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
