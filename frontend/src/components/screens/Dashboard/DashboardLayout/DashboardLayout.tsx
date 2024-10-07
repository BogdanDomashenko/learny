import { Avatar, Dropdown, Layout, Menu } from 'antd';
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { css, cx } from '@emotion/css';
import colors from 'tailwindcss/colors';
import { AiOutlineUser } from 'react-icons/ai';
import { ImLab } from 'react-icons/im';
import { MdDevicesOther } from 'react-icons/md';
import { useBreakpoint, useUser, useUserRole } from '../../../common/hooks';
import { ROUTES, ROUTE_NAMES } from '../../../common/constants';
import { HiOutlineMenu } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { userActions } from '../../../store/slices';
import { USER_ROLE } from '../../../common/constants/user.constants';
import { useLogoutMutation } from '../../../store/api';

type MenuItem = {
  key: number;
  icon: ReactNode;
  label: string;
  to: string;
};

const menuItems: MenuItem[] = [
  { key: 1, icon: <FaHome />, label: 'Home', to: ROUTES.dashboard.home },
  {
    key: 2,
    icon: <ImLab />,
    label: 'Experiments',
    to: ROUTES.dashboard.experiments.home,
  },
  {
    key: 3,
    icon: <MdDevicesOther />,
    label: 'Devices',
    to: ROUTES.dashboard.devices.home,
  },
];

const adminMenuItems: MenuItem[] = [
  {
    key: 4,
    icon: <ImLab />,
    label: 'Experiments',
    to: ROUTES.dashboard.admin.experiments.home,
  },
];

const menu = [
  {
    items: menuItems,
  },
  {
    label: 'Admin',
    items: adminMenuItems,
    role: USER_ROLE.ADMIN,
  },
];

export const Dashboard: FC = () => {
  const user = useUser();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isBreakpointLowerThan } = useBreakpoint();
  const isMobile = isBreakpointLowerThan('md');

  const siderRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLDivElement>(null);

  const role = useUserRole();

  const [isNavigationOpen, setIsNavigationOpen] = useState<boolean>(false);

  const [logout] = useLogoutMutation();

  const activeMenuItem = menu
    .find(({ items }) => items.some(({ to }) => to === pathname))
    ?.items.find(({ to }) => to === pathname)?.key;

  const routeName = Object.entries(ROUTE_NAMES).find(([route]) => pathname === route)?.[1];

  useEffect(() => {
    if (isMobile) {
      setIsNavigationOpen(false);
    }
  }, [isMobile]);

  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (
      siderRef.current &&
      !siderRef.current.contains(e.target as Node) &&
      !menuButtonRef.current?.contains(e.target as Node)
    ) {
      setIsNavigationOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isNavigationOpen) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isNavigationOpen]);

  const dropdownItems = [
    {
      key: '1',
      label: <div>Logout</div>,
      onClick: async () => {
        await logout();
        dispatch(userActions.logout());
      },
    },
  ];

  return (
    <Layout hasSider>
      {(!isMobile || isNavigationOpen) && (
        <Layout.Sider
          ref={siderRef}
          style={isBreakpointLowerThan('md') ? { position: 'fixed' } : undefined}
          className={cx(
            'bottom-0 left-0 top-0 z-20 h-screen overflow-auto',
            css`
              .ant-layout-sider-children {
                background-color: ${colors.blue[500]};
              }
            `,
          )}
        >
          <h1 className='px-1 py-3 text-center text-white'>Learny</h1>
          <div className='mt-12 flex flex-col gap-4'>
            {menu
              .filter((menuItem) => !menuItem.role || role === menuItem.role)
              .map(({ label, items }) => (
                <div>
                  {label && <span className='px-4 text-white'>{label}</span>}
                  <Menu
                    theme='dark'
                    mode='inline'
                    selectable={false}
                    activeKey={activeMenuItem?.toString()}
                    items={items}
                    className={cx(
                      'bg-transparent',
                      css`
                        .ant-menu-item {
                          &:hover {
                            background-color: ${colors.blue[600]} !important;
                          }
                        }
                        .ant-menu-item-active {
                          background-color: ${colors.blue[600]} !important;
                          color: white;
                          &:hover {
                            background-color: ${colors.blue[600]} !important;
                          }
                        }
                      `,
                    )}
                    onClick={({ key }) => {
                      const { to } = items.find((item) => item.key === Number(key)) || {};
                      if (to) {
                        navigate(to);
                      }
                    }}
                  />
                </div>
              ))}
          </div>
        </Layout.Sider>
      )}
      <Layout rootClassName='bg-white relative'>
        <Layout.Header className='fixed left-0 top-0 z-10 flex w-full items-center justify-between bg-stone-200 px-4 md:sticky'>
          <span>{routeName}</span>
          <div className='flex items-center gap-1'>
            <Dropdown menu={{ items: dropdownItems }} placement='bottomRight' trigger={['click']}>
              <div className='flex cursor-pointer items-center gap-2 text-gray-950'>
                <span className='text-sm'>
                  {user.data?.firstName} {user.data?.lastName}
                </span>
                <Avatar
                  size='default'
                  className='flex items-center justify-center'
                  icon={<AiOutlineUser />}
                />
              </div>
            </Dropdown>
            <div
              ref={menuButtonRef}
              className='flex cursor-pointer items-center justify-center text-xl lg:hidden'
              onClick={() => {
                setIsNavigationOpen(!isNavigationOpen);
              }}
            >
              <HiOutlineMenu />
            </div>
          </div>
        </Layout.Header>
        <Layout.Content>
          <div className='px-4 pb-20 pt-[80px] md:p-4 md:pt-4'>
            <Outlet />
          </div>
        </Layout.Content>
        <Layout.Footer className='fixed bottom-0 left-0 w-full bg-stone-200 text-center md:sticky'>
          Learny ©{new Date().getFullYear()}
        </Layout.Footer>
      </Layout>
    </Layout>
  );
};
