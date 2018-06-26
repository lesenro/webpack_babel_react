import React, { PureComponent } from 'react';
import { Menu, Icon, Tag, Divider, Modal } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
// import Debounce from 'lodash-decorators/debounce';
import { Link } from 'react-router-dom';
import './PageHeader.less';

const { confirm } = Modal;

export default class PageHeader extends PureComponent {
  componentWillUnmount() {
    // this.triggerResizeEvent.cancel();
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  quit = (ev) => {
    ev.preventDefault();
    confirm({
      title: '退出确认',
      content: '确认要退出登录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'login/logout',
          callback: (result) => {
            if (result.code === 0) {
              routerRedux.push('/user/login');
            } else {
              message.error(result.msg);
            }
          }
        });
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  };
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  //   @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const {
      collapsed,
      isMobile,
      logo,
      onMenuClick,
    } = this.props;
    const menu = (
      <Menu className="menu" selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item disabled>
          <Icon type="user" />个人中心
        </Menu.Item>
        <Menu.Item disabled>
          <Icon type="setting" />设置
        </Menu.Item>
        <Menu.Item key="triggerError">
          <Icon type="close-circle" />触发报错
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    return (
      <div className="header">
        {isMobile && [
          <Link to="/" className="logo" key="logo">
            <img src={logo} alt="logo"/>
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        <Icon
          className="trigger"
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className="right">
          <a className="action" onClick={this.quit}>
            <Icon type="logout" /> <span> 退出</span>
          </a>
        </div>
      </div>
    );
  }
}
