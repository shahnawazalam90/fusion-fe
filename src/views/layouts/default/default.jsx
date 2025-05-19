import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { NavLink } from "react-router";

import store from 'src/store';

import { clearData, setMenuVisibility } from "src/store/actions";
import classNames from 'classnames';

import './default.scss';

const menuItems = [
  {
    iconClass: 'bi bi-house-door-fill',
    title: 'Dashboard',
    path: '/dashboard',
  }, {
    iconClass: 'bi bi-file-earmark-arrow-up-fill',
    title: 'Upload',
    path: '/upload',
  }, {
    iconClass: 'bi bi-file-earmark-bar-graph-fill',
    title: 'Reports',
    path: '/reports',
  }, {
    iconClass: 'bi bi-alarm',
    title: 'Schedules',
    path: '/schedules',
  }
];

const DefaultLayout = ({ className, children }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const showMenu = useSelector((state) => state.menu_visibility);

  const handleLogout = () => {
    store.dispatch(clearData());
    navigate('/login');
  };

  return (
    <div className={classNames('default-layout-container position-relative d-flex flex-column', className)}>
      <div className='header-container position-fixed px-4 d-flex align-items-center justify-content-between w-100'>
        <div className='d-flex gap-3'>
          <button className='header-menu-button' onClick={() => store.dispatch(setMenuVisibility(!showMenu))}>
            <i className="menu-button-icon bi bi-list" />
          </button>
          <NavLink to='/dashboard'>
            <img className='header-logo' src='src\views\assets\logo.png' />
          </NavLink>
        </div>
        <div className='d-flex gap-3'>
          <i title={`${user.email} | ${user.firstName} ${user.lastName}`} className="menu-profile-icon bi bi-person-fill" />
          <button title='Logout' className='header-logout-button' onClick={handleLogout}>
            <i className="logout-button-icon bi bi-box-arrow-right" />
          </button>
        </div>
      </div>
      <div className='body-container flex-grow-1 d-flex'>
        <div className={classNames('menu-container position-fixed d-flex flex-column py-4', { 'active': showMenu })}>
          <div className='menu-items d-flex flex-column gap-3'>
            {menuItems.map((item, index) => (
              <button key={index} title={item.title} className={classNames('menu-item', { 'active': item.path === window.location.pathname })} onClick={() => navigate(item.path)}>
                <i className={item.iconClass} />
              </button>
            ))}
          </div>
        </div>
        <div className='body-content-wrapper d-flex flex-column flex-grow-1'>{children}</div>
      </div>
      <div className='footer-container d-flex align-items-center justify-content-center px-5'>
        <p className='footer-text m-0'>© 2025 OSI Digital, Inc. All rights reserved.</p>
      </div>
    </div>
  );
};

export default DefaultLayout;
