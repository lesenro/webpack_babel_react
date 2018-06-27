import React, { Component } from 'react';
import { Tooltip, notification } from 'antd';
import { observer } from 'mobx-react';
import { computed, reaction } from 'mobx';
import GridForm from "../../components/GridForm/GridForm";
import styles from './login.less';
import logopng from '../../assets/logo.svg';
import PageFooter from '../../components/PageFooter/PageFooter'
import { AppTools } from "../../utils/utils";
import globalStore from '../../models/global';
import loginStore from '../../models/login';
const loginForm = {
    Groups: {
        GroupType: "box",
        Name: "form1",
        Caption: "登录框",
    },
    Items: [{
        "InputType": "Text",
        "Name": "username",
        "GroupName": "form1",
        "Icon": "user",
        "ItemProps": {
            // "label": "用户名:"
        },
        "Props": {
            "placeholder": "请输入账户名",
            "size": "large",
            // "disabled": true,
        },
        "Rules": [{
            "max": 10,
            "message": "帐号名应在10个字符以内"
        },
        {
            "required": true,
            "message": "请输入帐号名"
        },
        {
            "whitespace": true,
            "message": "请输入帐号名"
        }]
    },
    {
        "InputType": "Password",
        "Name": "password",
        "Caption": "密码:",
        "Icon": "lock",
        "GroupName": "form1",
        "ItemProps": {
            // "label": "密码:"
        },
        "Props": {
            "placeholder": "请输入密码",
            "size": "large",
        },
        "Rules": [{
            "max": 12,
            "message": "密码应在12个字符以内"
        },
        {
            "required": true,
            "message": "请输入密码"
        }]
    }, {
        "InputType": "Text",
        "Name": "imageCode",
        "Caption": "验证码:",
        "Icon": "safety",
        "GroupName": "form1",
        "ItemProps": {
            // "label": "密码:"

        },
        "Props": {
            "placeholder": "请输入验证码",
            "size": "large",
            style: {
                width: "250px"
            }
        },
        "Rules": [{
            "len": 4,
            "message": "验证码应为4个字符"
        },
        {
            "required": true,
            "message": "请输入验证码",
        },]
    }],
    Global: {
        GroupsProps: {},
        ItemProps: {
            // labelCol: { span: 6 },
            // wrapperCol: { span: 14 },
        },
        ElementProps: {},
        SubmitItemProps: {
            className: "additional "+styles.additional,
        },
        SubmitButtonProps: {
            size: "large",
            className: "submit "+styles.submit,
            type: "primary",
            text: "登录"
        }
    }
};
const Header = (props) => {
    return (<div className={styles.top}>
        <div className={styles.Header}>
            <a href="#/"><img alt="logo" className={styles.logo} src={logopng} />
                <span className={styles.title}>{globalStore.appCfg.Company_name}</span>
            </a>
        </div>
        <div className={styles.desc}>{globalStore.appCfg.System_name}</div>
    </div>)
};


@observer
export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loginForm: loginForm,
        }
        this.codeImgChange = this.codeImgChange.bind(this);
    }

    @computed get codeimg() {
        // 正确的; 计算属性会追踪 `user.name` 属性
        return loginStore.codeimg;
    }

    componentWillMount() {
        const imgItem = loginForm.Items.find(x => x.Name == "imageCode");
        if (imgItem) {
            imgItem.BeforeChildren = <Tooltip placement="top" title="看不清,换一换">
                <img ref={img => this.refImg = img} className={styles["codeImg"]} src={this.codeimg} onClick={this.codeImgChange} />
            </Tooltip>;

            this.ImgCodeChanged = reaction(
                () => loginStore.codeimg,
                img => {
                    if (this.refImg) {
                        this.refImg.src = img
                    }
                }
            );

        }
        loginStore.setCodeImg();
    }
    componentWillUnmount() {
        this.ImgCodeChanged();
    }


    handleSubmit = (ev) => {
        const vals = AppTools.arrayToObject(ev);
        loginStore.Submit(vals, this.submited);
    }
    submited = (result) => {
        const { history } = this.props;
        //登录成功
        if (result.code === 0) {
            history.push("/admin");
        } else {
            notification.error({
                message: result.msg,
            });
            this.codeImgChange();
        }
    };


    codeImgChange() {
        loginStore.setCodeImg();
        this.editFrm.SetValues({ imageCode: "" });
    };

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <Header />
                    <div  className={styles.main}>
                        <GridForm onError={ev => {
                            console.log(ev);
                        }}
                            loading={loginStore.loading}
                            tmpl={this.state.loginForm}
                            submit={this.handleSubmit}
                            ref={frm => { this.editFrm = frm }} />
                    </div>
                </div>
                <PageFooter />
            </div>
        );
    }
}
