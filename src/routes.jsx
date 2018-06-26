import React from 'react';
import { Redirect, HashRouter } from 'react-router-dom';
import { Login, AdminLayout } from './pages'
import { createHashHistory } from 'history';
import globalStore from './models/global';
import RoutesContainer from './components/RoutesContainer/RoutesContainer';


const Sub = (props) => {
  
  return <div>子<p/><p/><p/><p/><p/><p/><p/><p/><p/><p/>页</div>
};
const Wrap = (props) => {
  return <RoutesContainer {...props} />
};
export const history = createHashHistory(location);
export const Router = HashRouter;

history.listen((location, action) => {
  globalStore.onRouterChanged(location, action);
});
export const routes = [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/login" />
  }, {
    path: '/login',
    name: '登录',
    component: Login
  }, {
    path: '/admin',
    component: AdminLayout,
    icon: "car",
    routes: [
      {
        path: '/admin',
        exact: true,
        isHidden: true,
        component: () => <Redirect to="/admin/home" />
      }, {
        path: '/admin/home',
        name: '管理首页',
        icon: 'home',
        component: Sub
      }, {
        path: '/admin/setting',
        name: '设置',
        icon: 'setting',
        component:Wrap,
        routes: [
          {
            path: '/admin/setting/sub1',
            name: '设置1',
            icon: 'home',
            component: Sub
          },{
            path: '/admin/setting/sub2',
            name: '设置2',
            icon: 'home',
            component: Sub
          },
        ]
      }
    ]
  }
];