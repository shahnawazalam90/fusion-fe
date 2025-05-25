import { NavLink } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Button, Popconfirm, Typography } from 'antd';
import {
  ClockCircleOutlined,
  CloudUploadOutlined,
  FileTextOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PoweroffOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import store from 'src/store';
import { clearData, setMenuVisibility } from 'src/store/actions';

import './default.scss';

const { Text } = Typography;

const menuItems = [
  {
    icon: <HomeOutlined />,
    title: 'Dashboard',
    path: '/dashboard',
  }, {
    icon: <CloudUploadOutlined />,
    title: 'Upload',
    path: '/upload',
  }, {
    icon: <FileTextOutlined />,
    title: 'Reports',
    path: '/reports',
  }, {
    icon: <ClockCircleOutlined />,
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
        <div className='d-flex align-items-center gap-3'>
          <Button
            className='header-menu-button'
            icon={showMenu ? <MenuFoldOutlined className='menu-button-icon' /> : <MenuUnfoldOutlined className='menu-button-icon' />}
            onClick={() => store.dispatch(setMenuVisibility(!showMenu))}
          />
          <NavLink to='/dashboard'>
            <img className='header-logo' src='src\views\assets\logo.png' />
          </NavLink>
        </div>
        <div className='d-flex align-items-center gap-3'>
          <UserOutlined title={`${user.email} | ${user.firstName} ${user.lastName}`} className='menu-profile-icon' />
          <Popconfirm
            title='Are you sure you want to logout?'
            onConfirm={handleLogout}
            okText='Yes'
            cancelText='No'
          >
            <Button
              className='header-logout-button'
              icon={<PoweroffOutlined className='logout-button-icon cursor-pointer' />}
            />
          </Popconfirm>
        </div>
      </div>
      <div className='body-container flex-grow-1 d-flex'>
        <div className={classNames('menu-container position-fixed d-flex flex-column py-4', { 'active': showMenu })}>
          <div className='menu-items d-flex flex-column gap-3'>
            {menuItems.map((item, index) => (
              <button
                key={index}
                title={item.title}
                className={classNames('menu-item cursor-pointer', { 'active': item.path === window.location.pathname })}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>
        <div className='body-content-wrapper d-flex flex-column flex-grow-1'>{children}</div>
      </div>
      <div className='footer-container d-flex align-items-center justify-content-center px-5'>
        <Text className='footer-text'>© 2025 OSI Digital, Inc. All rights reserved.</Text>
      </div>
    </div >
  );
};

export default DefaultLayout;
