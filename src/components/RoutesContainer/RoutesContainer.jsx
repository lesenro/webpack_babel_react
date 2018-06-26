
import React from 'react';
import { renderRoutes } from 'react-router-config';

export default class RoutesContainer extends React.Component {
    render() {
        
        return (
            <React.Fragment>{renderRoutes(this.props.route.routes)}</React.Fragment>
        );
    }
}