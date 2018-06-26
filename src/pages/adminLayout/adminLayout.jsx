import React from 'react';
import { Layout, Icon, message } from 'antd';
import { observer } from 'mobx-react';
import PageHeader from '../../components/PageHeader/PageHeader';
import PageFooter from '../../components/PageFooter/PageFooter';
import SiderMenu from '../../components/SiderMenu';
import RoutesContainer from '../../components/RoutesContainer/RoutesContainer';
import globalStore from '../../models/global';
import logo from '../../assets/logo.svg';

const { Content, Header, Footer } = Layout;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
    if (item && item.children) {
        if (item.children[0] && item.children[0].path) {
            redirectData.push({
                from: `${item.path}`,
                to: `${item.children[0].path}`,
            });

        }
    }
};

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
// const getBreadcrumbNameMap = (menuData, routerData) => {
//     const result = {};
//     const childResult = {};
//     // for (const i of menuData) {
//     //     if (!routerData[i.path]) {
//     //         result[i.path] = i;
//     //     }
//     //     if (i.children) {
//     //         Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
//     //     }
//     // }
//     return Object.assign({}, routerData, result, childResult);
// };

const query = {
    'screen-xs': {
        maxWidth: 575,
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767,
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991,
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199,
    },
    'screen-xl': {
        minWidth: 1200,
    },
};

let isMobile;
// enquireScreen(b => {
//   isMobile = b;
// });
@observer
export default class AdminLayout extends React.Component {
    //   static childContextTypes = {
    //     location: PropTypes.object,
    //     breadcrumbNameMap: PropTypes.object,
    //   };

    state = {
        isMobile,
    };

    componentDidMount() {
        // this.enquireHandler = enquireScreen(mobile => {
        //   this.setState({
        //     isMobile: mobile,
        //   });
        // });
        // this.props.dispatch({
        //   type: 'user/fetchCurrent',
        // });
    }
    componentWillUnmount() {

        // unenquireScreen(this.enquireHandler);
    }


    handleMenuCollapse = collapsed => {
        globalStore.setMenuCollapsed();
    };
    handleNoticeClear = type => {

    };
    handleMenuClick = ({ key }) => {

    };

    render() {
        const {
            fetchingNotices,
            notices,
        } = this.props;
        const layout = (
            <Layout className="layout-root">
                <SiderMenu
                    logo={logo}
                    // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
                    // If you do not have the Authorized parameter
                    // you will be forced to jump to the 403 interface without permission
                    menuData={globalStore.routes.slice()}
                    collapsed={globalStore.siderMenuCollapsed}
                    isMobile={this.state.isMobile}
                    onCollapse={this.handleMenuCollapse}
                />
                <Layout className="layout-main">
                    <Header style={{
                        padding: 0,
                        left: globalStore.siderMenuCollapsed ? 80 : 256
                    }}>
                        <PageHeader
                            logo={logo}
                            // currentUser={currentUser}
                            dispatch={this.props.dispatch}
                            fetchingNotices={fetchingNotices}
                            notices={notices}
                            collapsed={globalStore.siderMenuCollapsed}
                            isMobile={this.state.isMobile}
                            onNoticeClear={this.handleNoticeClear}
                            onCollapse={this.handleMenuCollapse}
                            onMenuClick={this.handleMenuClick}
                        />
                    </Header>
                    <Content style={{ margin: '24px 24px 0',height: '100%' }}>
                        <RoutesContainer {... this.props} />
                    </Content>
                    <Footer style={{ padding: 0 }}>
                        <PageFooter />
                    </Footer>
                </Layout>
            </Layout>
        );

        return (
            <div>{layout}</div>
        );
    }
}


