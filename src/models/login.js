import { observable, action, runInAction } from 'mobx';
import { oauthToken, logout, getCodeImg } from './platformApi';

class LoginStore {
    @observable codeimg = "";
    @observable loading = false;
    @action.bound
    async setCodeImg() {
        this.loading = true;
        this.codeimg = "";
        try {
            const result = await getCodeImg();
            // await 之后，再次修改状态需要动作:
            runInAction(() => {
                this.codeimg = "data:image/png;base64," + result.data;
            })
        } catch (error) {
            runInAction(() => {
                this.state = "error"
            })
        } finally {
            this.loading = false;
        }
    }
    async Submit(val,callback=null) {
        this.loading = true;
        try {
            const result = await oauthToken(val);
            // await 之后，再次修改状态需要动作:
            if(callback)callback(result);
        } catch (error) {
            runInAction(() => {
                this.state = "error"
            })
        } finally {
            this.loading = false;
        }
    }
    async logout(callback=null) {
        this.loading = true;
        try {
            const result = await logout();
            // await 之后，再次修改状态需要动作:
            if(callback)callback(result);
        } catch (error) {
            runInAction(() => {
                this.state = "error"
            })
        } finally {
            this.loading = false;
        }
    }
}
const store = new LoginStore();
export default store;