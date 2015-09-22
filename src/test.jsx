import React from 'react';
import { Animate } from './animate';

@Animate
export class TestComponent extends React.Component {
    render() {
        return (
            <div style={this.props.style}>Test</div>
        );
    }
}