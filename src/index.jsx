import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import {observable, action} from 'mobx';
import {Button,Tag} from 'antd';
import "./index.less";

var appState = observable({timer: 0});
appState.resetTimer = action(function reset() {
    appState.timer = 0;
});

setInterval(action(function tick() {
    appState.timer += 1;
}), 1000);

@observer
class TimerView extends React.Component {
    render() {
        return (
            <div>
                <Tag color="magenta">
                    Seconds passed: {this.props.appState.timer}
                </Tag>
                <Button
                    onClick={this
                    .onReset
                    .bind(this)}
                    type="primary">重置</Button>
            </div>
        );
    }

    onReset() {
        this
            .props
            .appState
            .resetTimer();
    }
};

ReactDOM.render(
    <TimerView appState={appState}/>, document.getElementById('root'));