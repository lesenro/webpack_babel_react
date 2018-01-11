import React from 'react';
import ReactDOM from 'react-dom';

class AppRoot extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                你好，世界!
            </div>
        );
    }

}
ReactDOM.render( <AppRoot></AppRoot>, document.getElementById('root'));