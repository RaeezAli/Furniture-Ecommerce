import Navigation from './components/common/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from './components/common/Footer.jsx';
import ScrollTop from './screens/ScrollTop.jsx';

export default function Layout() {
  return (
    <>
    <ScrollTop></ScrollTop>
      <Navigation />
      <Outlet />
      <Footer />
    </>
  )
}