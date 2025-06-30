import { Link, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';

function Navbar() {
  const { isAdmin, loginAdmin, logoutAdmin } = useContext(AdminContext);

  return (
    <nav className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          GreenGard
        </Link>
        <div className="space-x-4 hidden md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'underline underline-offset-4 font-semibold'
                : 'hover:underline'
            }
          >
            Головна
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              isActive
                ? 'underline underline-offset-4 font-semibold'
                : 'hover:underline'
            }
          >
            Послуги
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? 'underline underline-offset-4 font-semibold'
                : 'hover:underline'
            }
          >
            Про нас
          </NavLink>
          <NavLink
            to="/reviews"
            className={({ isActive }) =>
              isActive
                ? 'underline underline-offset-4 font-semibold'
                : 'hover:underline'
            }
          >
            Відгуки
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? 'underline underline-offset-4 font-semibold'
                : 'hover:underline'
            }
          >
            Довідник
          </NavLink>
        </div>

        <button
          onClick={isAdmin ? logoutAdmin : loginAdmin}
          className="bg-green-100 text-green-700 px-4 py-1 rounded hover:bg-green-200 transition"
        >
          {isAdmin ? 'Вийти з адміна' : 'Для Адміністрації'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
