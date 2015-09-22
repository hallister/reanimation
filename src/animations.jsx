import React from 'react';
import Transition from 'react-addons-transition-group';

export default class Animations extends React.Component {
    static proptypes = {
        enter: React.PropTypes.object,
        leave: React.PropTypes.object
    };

    static defaultProps = {
        enter: {},
        leave: {}
    };

    renderChildren() {
        return React.Children.map(this.props.children, child => {
            let props = {};

            props.enter = this.props.enter;
            props.leave = this.props.leave;

            return React.cloneElement(
                child,
                props
            );
        });
    }

    render() {
        return (
            <Transition {...this.props}>
                {this.renderChildren()}
            </Transition>
        );
    }
}