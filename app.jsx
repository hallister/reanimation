import React from 'react';
import ReactDOM from 'react-dom';
import { Animate } from './src/animate.jsx';
import Animations from './src/animations.jsx';

@Animate
export class TestComponent extends React.Component {
    render() {
        return (
            <div style={this.props.style}>Test</div>
        );
    }
}

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.start = {
            opacity: 0
        };

        this.end = {
            opacity: 1
        };

        this.enter = {
            duration: 500,
            ease: 'in-circ',
            from: {
                opacity: 0
            },
            to: {
                opacity: 1
            }
        };

        this.leave = {
            duration: 250,
            ease: 'out-circ',
            from: {
                opacity: 1
            },
            to: {
                opacity: 0
            }
        };

        this.duration = 500;

        this.state = {
            items: [],
            start: Object.assign({}, this.start),
            end: Object.assign({}, this.end),
            active: false,
            cancel: false
        };
    }

    onAddChild() {
        let items = this.state.items;

        items.push(
            <TestComponent key={this.state.items.length} />
        );

        this.setState({
            items: items
    });
    }

    onRemoveChild() {
        let items = this.state.items;

        items.pop();

        this.setState({
            items: items
        });
    }

    onCancelClick() {
        if (this.state.active) {
            this.setState({
                cancel: true,
                active: true
            });
        }
    }

    onClick() {
        this.setState({
            active: true
        });
    }

    onComplete() {
        if(!this.state.cancel) {
            let start = Object.assign({}, this.start);
            let end = Object.assign({}, this.end);

            this.end = start;
            this.start = end;
        }

        this.setState({
            active: false,
            cancel: false
        });

    }

    render() {
        return (
            <div>
                <button onClick={this.onClick.bind(this)}>Test</button>
                <button onClick={this.onCancelClick.bind(this)}>Cancel</button>
                <TestComponent startState={this.start} endState={this.end} cancel={this.state.cancel} animate={this.state.active} onComplete={this.onComplete.bind(this)}>
                    test
                </TestComponent>
                <button onClick={this.onAddChild.bind(this)}>Add Child</button>
                <button onClick={this.onRemoveChild.bind(this)}>Remove Child</button>
                <Animations enter={this.enter} leave={this.leave}>
                    {this.state.items}
                </Animations>

            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));