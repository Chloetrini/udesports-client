import './App.css'
import {RouterProvider} from 'react-router'
 import { ToastContainer } from 'react-toastify';
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
