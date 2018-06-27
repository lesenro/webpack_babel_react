import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import { observer } from 'mobx-react';

import styles from './index.less';
import globalStore from '../../models/global';

const { Sider } = Layout;
const { SubMenu } = Menu;
const appcfg = window.AppConfigs;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
    if (typeof icon === 'string' && icon.indexOf('http') === 0) {
        return <img src={icon} alt="icon" className={`${styles.icon} sider-menu-item-img`} />;
    }
    if (typeof icon === 'string') {
        return <Icon type={icon} />;
    }
    return icon;
};


@observer
export default class SiderMenu extends React.Component {
    constructor(props) {
        super(props);
        this.menus = props.menuData;

    }
    componentWillReceiveProps(nextProps) {

    }

    /**
     * 判断是否是http链接.返回 Link 或 a
     * Judge whether it is http link.return a or Link
     * @memberof SiderMenu
     */
    getMenuItemPath = item => {
        const itemPath = this.conversionPath(item.path);
        const icon = getIcon(item.icon);
        const { target, name } = item;
        // Is it a http link
        if (/^https?:\/\//.test(itemPath)) {
            return (
                <a href={itemPath} target={target}>
                    {icon}
                    <span>{name}</span>
                </a>
            );
        }
        return (
            <Link
                to={itemPath}
                target={target}
                onClick={
                    this.props.isMobile
                        ? () => {
                            this.props.onCollapse(true);
                        }
                        : undefined
                }
            >
                {icon}
                <span>{name}</span>
            </Link>
        );
    };
    /**
     * get SubMenu or Item
     */
    getSubMenuOrItem = item => {
        if (item.routes && item.routes.some(child => child.name)) {
            const childrenItems = this.getNavMenuItems(item.routes);
            // 当无子菜单时就不展示菜单
            if (childrenItems && childrenItems.length > 0) {
                return (
                    <SubMenu
                        title={
                            item.icon ? (
                                <span>
                                    {getIcon(item.icon)}
                                    <span>{item.name}</span>
                                </span>
                            ) : (
                                    item.name
                                )
                        }
                        key={item.path}
                    >
                        {childrenItems}
                    </SubMenu>
                );
            }
            return null;
        } else {
            return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
        }
    };
    /**
     * 获得菜单子节点
     * @memberof SiderMenu
     */
    getNavMenuItems = menusData => {
        if (!menusData) {
            return [];
        }
        return menusData
            .filter(item => item.name && !item.isHidden)
            .map(item => {

                // make dom
                const ItemDom = this.getSubMenuOrItem(item);
                return ItemDom;
            })
            .filter(item => item);
    };

    // conversion Path
    // 转化路径
    conversionPath = path => {
        if (path && path.indexOf('http') === 0) {
            return path;
        } else {
            return `/${path || ''}`.replace(/\/+/g, '/');
        }
    };


    handleOpenChange = openKeys => {
        globalStore.setOpenKeys(openKeys);
    };

    render() {
        const { logo, collapsed, onCollapse } = this.props;
        const selectedKeys = [globalStore.currentRouter.path];
        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                breakpoint="lg"
                onCollapse={onCollapse}
                width={256}
                className={styles.sider}
            >
                <div className={styles.logo} key="logo">
                    <Link to="/">
                        <img src={logo} alt="logo" />
                        <h1>{appcfg.System_name}</h1>
                    </Link>
                </div>
                <Menu
                    key="Menu"
                    theme="dark"
                    mode="inline"
                    openKeys={globalStore.openKeys.slice()}
                    onOpenChange={this.handleOpenChange}
                    selectedKeys={selectedKeys}
                    style={{ padding: '16px 0', width: '100%' }}
                >
                    {this.getNavMenuItems(this.menus.find(x => x.path === '/admin').routes)}
                </Menu>
            </Sider>
        );
    }
}
