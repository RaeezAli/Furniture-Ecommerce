// import Footer from './components/Footer/Footer'
import Navigation from './components/Navbar.jsx';
import { Outlet } from 'react-router-dom';
export default function Layout() {
  return (
    <>
      <Navigation />
      <Outlet />
      {/* <Footer /> */}
    </>
  )
}