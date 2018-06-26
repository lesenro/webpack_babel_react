import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DocumentTitle from 'react-document-title';
import { observer } from 'mobx-react';
import { renderRoutes } from 'react-router-config';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import "./index.less";
import { routes, Router } from './routes';
import globalStore from './models/global';
@observer
class AppView extends Component {
    componentWillMount(){
        globalStore.setRoutes(routes);
        globalStore.onRouterChanged({
            pathname:location.hash.replace("#","")
        });
    }
    render() {
        const {store} = this.props;
        return <DocumentTitle title={store.pageTitle}>
            <LocaleProvider locale={zhCN}>
                <Router>
                    {renderRoutes(routes)}
                </Router>
            </LocaleProvider>
        </DocumentTitle>
    }
}

ReactDOM.render(
    <AppView store={globalStore} />
    , document.getElementById('root'));