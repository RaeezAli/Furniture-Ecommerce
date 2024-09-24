import Navigation from './components/common/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from './components/common/Footer.jsx';
export default function Layout() {
  return (
    <>
      <Navigation />
      <Outlet />
      <Footer />
    </>
  )
}