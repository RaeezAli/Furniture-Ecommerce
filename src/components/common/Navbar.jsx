import { NavLink } from 'react-router-dom';

// Styling
import '../../App.jsx';

// Logo
import Logo from '../../assets/Logo.jsx';
// import Icon from '../assets/Icon.jsx';

// Icons
import AcountIcon from '../../assets/Acount-Alert.jsx';
import SearchIcon from '../../assets/SearchIcon.jsx';
import HeartIcon from '../../assets/Heart.jsx';
import CartIcon from '../../assets/Cart.jsx';

export default function Navbar() {

    const activeColor = {
        color: 'rgba(184, 142, 47, 1)'
    }

    const nonActiveColor = {
        color: 'rgb(0, 0, 0)'
    }

    return (
        <header className="w-full bg-white px-16 py-7 flex flex-row justify-between items-center fixed top-0 left-0 z-50">
            <div className="h-full flex items-center">
                {/* <Icon /> */}
                <Logo />
            </div>
            <nav className="features-links-tags h-full flex justify-center gap-12">
                <NavLink
                    to='/'
                    style={({ isActive }) => (isActive ? activeColor : nonActiveColor)}
                >Home</NavLink>
                <NavLink
                    to='/shop'
                    style={({ isActive }) => (isActive ? activeColor : nonActiveColor)}
                >Shop</NavLink>
                <NavLink
                    to='/about'
                    style={({ isActive }) => (isActive ? activeColor : nonActiveColor)}
                >About</NavLink>
                <NavLink
                    to='/contact'
                    style={({ isActive }) => (isActive ? activeColor : nonActiveColor)}
                >Contact</NavLink>
            </nav>
            <div className="h-full flex items-center gap-8">
                <AcountIcon />
                <SearchIcon />
                <HeartIcon />
                <CartIcon />
            </div>
        </header>
    )
}
