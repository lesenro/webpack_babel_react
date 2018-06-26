import { observable, action, computed } from 'mobx';
import lodash from 'lodash';
import { matchRoutes } from 'react-router-config';
const appcfg = window["AppConfigs"];

class Global {
    @observable siderMenuCollapsed = false;
    @observable appCfg = appcfg;
    @observable routes = [];
    @observable currentRouter = {};
    @observable openKeys = [];

    @computed get pageTitle() {
        const title = this.currentRouter.name;
        return (title ? title + '-' : '') + this.appCfg.System_name;
    };
    @computed get flatRouters() {
        return lodash.flattenDeep(this.routes.slice());
    }


    @action.bound
    setMenuCollapsed() {
        this.siderMenuCollapsed = !this.siderMenuCollapsed;
        if(this.siderMenuCollapsed){
            this.openKeys=[];
        }else{
            this.onRouterChanged({
                pathname:location.hash.replace("#","")
            })
        }
    }
    @action.bound
    setRoutes(routes) {
        this.routes = routes;
    }

    @action.bound
    onRouterChanged(location, action) {
        const { pathname } = location;
        let rs = matchRoutes(this.routes.slice(), pathname);
        if (rs.length > 0) {
            rs = rs.sort((a, b) => b.route.path.length - a.route.path.length);
            this.currentRouter = rs[0].route;
            this.openKeys=rs.map(x=>x.route.path);
        }

        // location是location对象
        // action是动作名称，比如 "PUSH"
    }
    @action.bound
    setOpenKeys(okeys) {
        this.openKeys = okeys;
    }
}

const globalStore = new Global();

export default globalStore;