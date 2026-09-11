import { Outlet } from 'react-router'
import NavBar from '@/components/universal/NavBar'
import Footer from '@/components/universal/Footer'
import UpdateBar from '@/components/universal/UpdateBar'

export default function MainLayout() {
  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      <NavBar />
      <UpdateBar/>
      <Outlet />
      <Footer />
    </div>
  )
}


