import './App.css'
import {RouterProvider} from 'react-router'
 import { ToastContainer } from 'react-toastify';
 import {  QueryClientProvider } from '@tanstack/react-query'
import {router} from './routes'
import { queryClient } from './lib/utils';

function App() {


  return (
    <>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
       <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  )
}

export default App
