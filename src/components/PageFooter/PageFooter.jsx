import React from 'react';
import { Link } from 'react-router-dom';
import globalStore from '../../models/global';

import styles from './PageFooter.less';
const links = [
    {
        key: "home",
        title: "首页",
        href: "/"
    }, {
        key: "admin",
        title: "关于",
        href: "/admin"
    }, {
        key: "help",
        title: "帮助",
        href: "/help"
    },
];
const PageFooter = () => {
    return (
        <div className={styles.globalFooter}>
            {links && (
                <div className={styles.links}>
                    {links.map(link => (
                        <Link key={link.key} to={link.href} >{link.title}</Link>
                    ))}
                </div>
            )}
            {globalStore.appCfg && <div className={styles.copyright}>{globalStore.appCfg.Copyright}</div>}
        </div>
    );
};

export default PageFooter;
